import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wikipediaService } from "./services/wikipedia";
import { openaiService } from "./services/openai";
import { openRouterService } from "./services/openrouter";
import { exportService } from "./services/export";
import { insertComparisonSchema, insertSearchSessionSchema, insertHighlightSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import { chatWithGrok } from './services/openaiChat';
import { createCheckoutSession } from './services/maxelpay';

const FREE_GENERATION_LIMIT = 1;

// Free models to try in order of preference (shared between comparison and chat)
const freeModels = [
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-7b-instruct:free", 
  "microsoft/phi-3.5-mini-instruct:free",
  "mistralai/mistral-7b-instruct:free"
];

// Helper function for OpenRouter API calls with fallback
async function callOpenRouterWithFallback(messages: any[], temperature = 0.7, maxTokens = 500): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  for (let i = 0; i < freeModels.length; i++) {
    const model = freeModels[i];
    console.log(`Attempting chat with model: ${model}`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5000',
          'X-Title': 'WikiTruth',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chat model ${model} failed:`, errorText);
        
        if (i === freeModels.length - 1) {
          throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }
        continue;
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content;
      
      if (result) {
        console.log(`Successfully used chat model: ${model}`);
        return result;
      }
      
      if (i === freeModels.length - 1) {
        throw new Error('No chat response generated from any model');
      }
      
    } catch (error) {
      console.error(`Chat model ${model} error:`, error);
      
      if (i === freeModels.length - 1) {
        throw new Error(`OpenRouter chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      continue;
    }
  }
  
  throw new Error('All OpenRouter chat models failed');
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Wikipedia search endpoint with optimized filtering
  app.get("/api/wikipedia/search", async (req, res) => {
    try {
      const { query, language = 'en', limit = 10 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      // Fetch more results initially since we'll filter some out
      const initialLimit = Math.max(Number(limit) * 2, 15);
      const results = await wikipediaService.searchArticles(
        query,
        language as string,
        initialLimit
      );
      
      // Batch check language links for better performance
      const languageLinksPromises = results.map(async (result) => {
        try {
          const languageLinks = await wikipediaService.getLanguageLinks(
            result.title,
            language as string
          );
          return {
            result,
            hasMultipleLanguages: languageLinks.length > 0,
            languageCount: languageLinks.length + 1 // +1 for the original language
          };
        } catch (error) {
          return {
            result,
            hasMultipleLanguages: false,
            languageCount: 1
          };
        }
      });
      
      // Process all language link checks in parallel
      const languageResults = await Promise.allSettled(languageLinksPromises);
      
      // Filter and sort results
      const filteredResults = languageResults
        .filter((promiseResult): promiseResult is PromiseFulfilledResult<any> => 
          promiseResult.status === 'fulfilled'
        )
        .map(promiseResult => promiseResult.value)
        .filter(item => item.hasMultipleLanguages)
        .sort((a, b) => b.languageCount - a.languageCount) // Sort by number of languages (more = better)
        .slice(0, Number(limit))
        .map(item => item.result);
      
      res.json(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // Get language links for an article
  app.get("/api/wikipedia/languages", async (req, res) => {
    try {
      const { title, language = 'en' } = req.query;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Title parameter is required" });
      }

      const languageLinks = await wikipediaService.getLanguageLinks(
        title,
        language as string
      );
      
      res.json(languageLinks);
    } catch (error) {
      console.error('Language links error:', error);
      res.status(500).json({ error: "Failed to fetch language links" });
    }
  });

  // Get article content
  app.get("/api/wikipedia/article", async (req, res) => {
    try {
      const { title, language = 'en' } = req.query;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Title parameter is required" });
      }

      const article = await wikipediaService.getArticleContent(
        title,
        language as string
      );
      
      res.json(article);
    } catch (error) {
      console.error('Article content error:', error);
      res.status(500).json({ error: "Failed to fetch article content" });
    }
  });

  // Create search session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = {
        sessionId: nanoid(),
        searchQuery: null,
        selectedArticle: null,
        availableLanguages: null,
        ...req.body
      };

      const validatedData = insertSearchSessionSchema.parse(sessionData);
      const session = await storage.createSearchSession(validatedData);
      
      res.json(session);
    } catch (error) {
      console.error('Session creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Update search session
  app.patch("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;

      const session = await storage.updateSearchSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Session update error:', error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Get search session
  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getSearchSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Session fetch error:', error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Compare articles with plan selection support (accepts client-provided articles)
  app.post("/api/compare", async (req, res) => {
    try {
      const { 
        articleTitle, 
        selectedLanguages, 
        outputLanguage, 
        baseLanguage = 'en',
        isFunnyMode = false,
        isPremium = false,
        articles = null, // Client can provide pre-fetched articles
        premiumOptions = null, // Premium analysis options (outputFormat, focusPoints, formality, analysisMode)
        visitorId = null // For generation tracking as backend fail-safe
      } = req.body;

      if (!articleTitle || !selectedLanguages || !outputLanguage) {
        return res.status(400).json({ 
          error: "Missing required fields: articleTitle, selectedLanguages, outputLanguage" 
        });
      }

      if (selectedLanguages.length < 2 || selectedLanguages.length > 5) {
        return res.status(400).json({ 
          error: "Must select between 2 and 5 languages for comparison" 
        });
      }

      let articleData: Record<string, string> = {};
      let fetchedArticles: Array<{title: string, content: string, language: string, contentLength: number}> = [];

      // Use client-provided articles if available, otherwise fetch from server
      if (articles && typeof articles === 'object') {
        articleData = articles;
        // Create mock article objects for storage
        fetchedArticles = Object.entries(articles).map(([language, content]) => ({
          title: articleTitle,
          content: content as string,
          language,
          contentLength: (content as string).length
        }));
      } else {
        // Fetch article contents for all selected languages (server-side)
        const serverFetchedArticles = await wikipediaService.getMultipleArticleContents(
          articleTitle, 
          selectedLanguages,
          baseLanguage
        );

        if (serverFetchedArticles.length < 2) {
          return res.status(400).json({ 
            error: "Could not fetch articles for at least 2 languages" 
          });
        }

        // Prepare articles for AI processing
        serverFetchedArticles.forEach(article => {
          articleData[article.language] = article.content;
        });
        fetchedArticles = serverFetchedArticles.map(article => ({
          title: article.title,
          content: article.content,
          language: article.language,
          contentLength: article.content.length
        }));
      }

      // All users get OpenAI analysis
      console.log('Using OpenAI for article comparison analysis');
      console.log('Premium options:', premiumOptions);
      const comparisonResult = await openaiService.compareArticles({
        articles: articleData,
        outputLanguage,
        isFunnyMode,
        premiumOptions
      });

      // Save comparison to storage
      const comparisonData = insertComparisonSchema.parse({
        articleTitle,
        selectedLanguages,
        outputLanguage,
        comparisonResult,
        isFunnyMode,
        isPremium
      });

      const savedComparison = await storage.createComparison(comparisonData);
      
      // Backend fail-safe: Record generation if visitorId is provided
      if (visitorId) {
        try {
          let user = await storage.getUserByVisitorId(visitorId);
          if (user) {
            await storage.recordGeneration(visitorId);
          }
        } catch (recordErr) {
          console.error('Backend fail-safe: Failed to record generation:', recordErr);
        }
      }
      
      res.json({
        ...savedComparison,
        articles: fetchedArticles.map(a => ({ 
          language: a.language, 
          title: a.title,
          contentLength: a.contentLength 
        }))
      });
    } catch (error: any) {
      console.error('Comparison error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      }
      const errorMessage = error.message || "Failed to generate comparison";
      res.status(500).json({ error: errorMessage });
    }
  });

  // OpenRouter comparison endpoint - Free for all users
  app.post("/api/openrouter/compare", async (req, res) => {
    try {
      const { articles, outputLanguage, isFunnyMode = false } = req.body;
      
      if (!articles || typeof articles !== 'object') {
        return res.status(400).json({ error: "Articles data is required" });
      }
      
      if (!outputLanguage) {
        return res.status(400).json({ error: "Output language is required" });
      }

      // Generate comparison using OpenRouter API - completely free
      const comparisonResult = await openRouterService.compareArticles({
        articles,
        outputLanguage,
        isFunnyMode
      });

      res.json({ comparisonResult });
    } catch (error) {
      console.error('OpenRouter comparison error:', error);
      res.status(500).json({ error: "Failed to generate comparison using OpenRouter" });
    }
  });

  // Legacy OpenAI endpoint for premium users (deprecated - keeping for compatibility)
  app.post("/api/openai/compare", async (req, res) => {
    try {
      const { articles, outputLanguage, isFunnyMode = false } = req.body;
      
      if (!articles || typeof articles !== 'object') {
        return res.status(400).json({ error: "Articles data is required" });
      }
      
      if (!outputLanguage) {
        return res.status(400).json({ error: "Output language is required" });
      }

      // Generate comparison using server's OpenAI API key
      const comparisonResult = await openaiService.compareArticles({
        articles,
        outputLanguage,
        isFunnyMode
      });

      res.json({ comparisonResult });
    } catch (error) {
      console.error('OpenAI comparison error:', error);
      res.status(500).json({ error: "Failed to generate comparison using OpenAI" });
    }
  });

  // Chat with comparison findings (Premium feature using free model)
  app.post("/api/chat-comparison", async (req, res) => {
    try {
      const { message, comparisonContext, articleTitle, selectedLanguages, chatHistory } = req.body;
      
      if (!message || !comparisonContext) {
        return res.status(400).json({ error: "Message and comparison context are required" });
      }

      // Build context for the chat
      const contextPrompt = `You are a helpful assistant discussing a Wikipedia comparison analysis. The user has received a comparison of "${articleTitle}" across languages: ${selectedLanguages.join(', ')}.

Here is the comparison analysis they received:
${comparisonContext}

The user is now asking about this analysis. Please provide helpful, conversational responses based on the comparison findings. Be friendly and informative.`;

      // Use OpenRouter with fallback mechanism
      const messages = [
        { role: "system", content: contextPrompt },
        ...chatHistory,                 // [{role:'user'|'assistant', content:'…'}]
        { role: "user", content: message }
      ];

      let reply: string;

      try {
        // 1) Try Grok API first
        reply = await chatWithGrok(messages, 0.7, 500);
      } catch (err) {
        console.error('Grok failed, falling back to OpenRouter', err);
        // 2) If Grok fails, fallback to OpenRouter
        reply = await callOpenRouterWithFallback(messages, 0.7, 500);
      }

      res.json({ response: reply });
      } catch (error) {
       console.error('Chat error:', error);
       res.status(500).json({ error: "Failed to generate chat response" });
     }
   });

  // Payment session creation endpoint (Smart Glocal integration)
  app.post("/api/payments/create-session", async (req, res) => {
    try {
      const { amount, currency, orderId, customerId, description, returnUrl } = req.body;
      
      if (!amount || !currency || !orderId || !customerId) {
        return res.status(400).json({ error: "Missing required payment parameters" });
      }

      // For now, return demo payment URL since we need proper Smart Glocal credentials
      // In production, this would create a real Smart Glocal session
      const demoPaymentUrl = `${returnUrl}?demo=true&order_id=${orderId}&amount=${amount}`;
      
      res.json({ 
        paymentUrl: demoPaymentUrl,
        sessionId: `demo_session_${orderId}`,
        message: "Demo payment session created. In production, this would create a real Smart Glocal payment session."
      });
    } catch (error) {
      console.error('Payment session creation error:', error);
      res.status(500).json({ error: "Failed to create payment session" });
    }
  });

  // Library - get public comparisons
  app.get("/api/library", async (req, res) => {
    try {
      const { language, limit = '20', offset = '0' } = req.query;
      
      const comparisons = await storage.getPublicComparisons(
        language as string | undefined,
        Number(limit),
        Number(offset)
      );
      
      const total = await storage.getPublicComparisonsCount(language as string | undefined);
      
      res.json({
        comparisons,
        total,
        hasMore: Number(offset) + comparisons.length < total
      });
    } catch (error) {
      console.error('Library fetch error:', error);
      res.status(500).json({ error: "Failed to fetch library comparisons" });
    }
  });

  // Get comparison by ID
  app.get("/api/compare/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      console.error('Comparison fetch error:', error);
      res.status(500).json({ error: "Failed to fetch comparison" });
    }
  });

  // Export comparison as DOCX (from stored data)
  app.get("/api/compare/:id/export", async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      const docxBuffer = await exportService.generateDocx({
        articleTitle: comparison.articleTitle,
        languages: comparison.selectedLanguages as string[],
        outputLanguage: comparison.outputLanguage,
        content: comparison.comparisonResult || "No comparison available",
        isFunnyMode: comparison.isFunnyMode || false
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="wiki-truth-comparison.docx"');
      res.send(docxBuffer);
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: "Failed to export comparison" });
    }
  });

  // Direct DOCX export endpoint (from client data)
  app.post("/api/export/docx", async (req, res) => {
    try {
      const { articleTitle, languages, outputLanguage, content, isFunnyMode } = req.body;

      if (!articleTitle || !languages || !content) {
        return res.status(400).json({ error: "Missing required data for export" });
      }

      const docxBuffer = await exportService.generateDocx({
        articleTitle,
        languages,
        outputLanguage: outputLanguage || 'en',
        content,
        isFunnyMode: isFunnyMode || false
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="wiki-truth-comparison.docx"');
      res.send(docxBuffer);
    } catch (error) {
      console.error('Direct export error:', error);
      res.status(500).json({ error: "Failed to export comparison" });
    }
  });

  // Share comparison endpoint
  app.get("/api/compare/:id/share", async (req, res) => {
    try {
      const { id } = req.params;
      const { platform } = req.query;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      const shareUrl = `${req.protocol}://${req.get('host')}/comparison/${id}`;
      const selectedLangs = comparison.selectedLanguages as string[];
      const languageList = selectedLangs.join(', ');
      
      let shareText = '';
      
      switch (platform) {
        case 'twitter':
        case 'x':
          shareText = `Fascinating Wikipedia comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages reveals cultural differences! ${shareUrl} #WikiTruth #Wikipedia`;
          break;
        case 'linkedin':
          shareText = `I just compared the Wikipedia article "${comparison.articleTitle}" across ${selectedLangs.length} languages (${languageList}). The AI analysis reveals interesting cultural perspectives and factual variations. Check it out: ${shareUrl}`;
          break;
        case 'whatsapp':
        case 'telegram':
          shareText = `Check out this interesting Wikipedia comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages. The differences are quite revealing! ${shareUrl}`;
          break;
        case 'reddit':
          shareText = `TIL: The Wikipedia article for "${comparison.articleTitle}" varies significantly across ${selectedLangs.length} languages. Here's an AI analysis of the differences: ${shareUrl}`;
          break;
        default:
          shareText = `Wikipedia Comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages (${languageList}). See the cultural differences and perspectives: ${shareUrl}`;
      }

      res.json({ 
        shareText, 
        shareUrl,
        title: comparison.articleTitle,
        languages: selectedLangs.length
      });
    } catch (error) {
      console.error('Share error:', error);
      res.status(500).json({ error: "Failed to generate share content" });
    }
  });

  // OpenAI API proxy endpoints for CORS bypass
  app.post('/api/openai/chat/completions', async (req, res) => {
    try {
      const { apiKey, ...requestBody } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('OpenAI proxy error:', error);
      res.status(500).json({ error: 'Failed to process OpenAI request' });
    }
  });

  // OpenAI models endpoint proxy
  app.get('/api/openai/models', async (req, res) => {
    try {
      const apiKey = req.headers.authorization?.replace('Bearer ', '');
      
      if (!apiKey) {
        return res.status(400).json({ error: 'Authorization header with API key is required' });
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('OpenAI models proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  // Highlights API endpoints
  
  // Get highlights for a comparison
  app.get('/api/comparisons/:id/highlights', async (req, res) => {
    try {
      const { id } = req.params;
      const comparisonId = Number(id);
      
      if (isNaN(comparisonId)) {
        return res.status(400).json({ error: 'Invalid comparison ID' });
      }

      const highlights = await storage.getHighlightsByComparisonId(comparisonId);
      res.json(highlights);
    } catch (error) {
      console.error('Get highlights error:', error);
      res.status(500).json({ error: 'Failed to fetch highlights' });
    }
  });

  // Create a new highlight
  app.post('/api/comparisons/:id/highlights', async (req, res) => {
    try {
      const { id } = req.params;
      const comparisonId = Number(id);
      
      if (isNaN(comparisonId)) {
        return res.status(400).json({ error: 'Invalid comparison ID' });
      }

      const highlightData = {
        comparisonId,
        ...req.body
      };

      const validatedData = insertHighlightSchema.parse(highlightData);
      const highlight = await storage.createHighlight(validatedData);
      
      res.status(201).json(highlight);
    } catch (error) {
      console.error('Create highlight error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid highlight data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create highlight' });
    }
  });

  // Delete a highlight
  app.delete('/api/highlights/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const highlightId = Number(id);
      
      if (isNaN(highlightId)) {
        return res.status(400).json({ error: 'Invalid highlight ID' });
      }

      const deleted = await storage.deleteHighlight(highlightId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Highlight not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete highlight error:', error);
      res.status(500).json({ error: 'Failed to delete highlight' });
    }
  });

  // Delete all highlights for a comparison
  app.delete('/api/comparisons/:id/highlights', async (req, res) => {
    try {
      const { id } = req.params;
      const comparisonId = Number(id);
      
      if (isNaN(comparisonId)) {
        return res.status(400).json({ error: 'Invalid comparison ID' });
      }

      await storage.deleteHighlightsByComparisonId(comparisonId);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete all highlights error:', error);
      res.status(500).json({ error: 'Failed to delete highlights' });
    }
  });

  // Get or create user by visitor ID
  app.post('/api/user', async (req, res) => {
    try {
      const { visitorId } = req.body;
      if (!visitorId) {
        return res.status(400).json({ error: 'visitorId is required' });
      }
      const user = await storage.getOrCreateUser(visitorId);
      res.json(user);
    } catch (error) {
      console.error('Get/create user error:', error);
      res.status(500).json({ error: 'Failed to get or create user' });
    }
  });

  // Check if user can generate (has free generations left or is premium)
  app.post('/api/user/can-generate', async (req, res) => {
    try {
      const { visitorId } = req.body;
      if (!visitorId) {
        return res.status(400).json({ error: 'visitorId is required' });
      }
      const user = await storage.getOrCreateUser(visitorId);
      
      // Check if subscription is expired
      const now = new Date();
      const isSubscriptionValid = user.isPremium && 
        (!user.subscriptionExpiresAt || user.subscriptionExpiresAt > now);
      
      const canGenerate = isSubscriptionValid || user.generationsUsed < FREE_GENERATION_LIMIT;
      const remainingFree = Math.max(0, FREE_GENERATION_LIMIT - user.generationsUsed);
      
      res.json({ 
        canGenerate, 
        isPremium: isSubscriptionValid,
        generationsUsed: user.generationsUsed,
        remainingFree,
        freeLimit: FREE_GENERATION_LIMIT
      });
    } catch (error) {
      console.error('Check generation eligibility error:', error);
      res.status(500).json({ error: 'Failed to check generation eligibility' });
    }
  });

  // Record a generation (increment counter)
  app.post('/api/user/record-generation', async (req, res) => {
    try {
      const { visitorId } = req.body;
      if (!visitorId) {
        return res.status(400).json({ error: 'visitorId is required' });
      }
      const user = await storage.incrementUserGenerations(visitorId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ generationsUsed: user.generationsUsed });
    } catch (error) {
      console.error('Record generation error:', error);
      res.status(500).json({ error: 'Failed to record generation' });
    }
  });

  // Create MaxelPay checkout session
  app.post('/api/billing/create-checkout', async (req, res) => {
    try {
      const { visitorId, email, userName } = req.body;
      if (!visitorId || !email) {
        return res.status(400).json({ error: 'visitorId and email are required' });
      }

      const user = await storage.getOrCreateUser(visitorId);
      await storage.updateUserEmail(visitorId, email);

      const orderId = `WT-${nanoid(12)}`;
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'http://localhost:5000';

      // Create payment record
      await storage.createPayment({
        userId: user.id,
        orderId,
        amount: '5',
        currency: 'USD',
        status: 'pending'
      });

      const { checkoutUrl } = await createCheckoutSession({
        orderId,
        amount: '5',
        userEmail: email,
        userName: userName || 'WikiTruth User',
        baseUrl
      });

      res.json({ checkoutUrl, orderId });
    } catch (error) {
      console.error('Create checkout error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // MaxelPay webhook
  app.post('/api/maxelpay/webhook', async (req, res) => {
    try {
      const { orderId, status, transactionId } = req.body;
      console.log('MaxelPay webhook received:', { orderId, status, transactionId });

      if (!orderId || !status) {
        return res.status(400).json({ error: 'Invalid webhook payload' });
      }

      const payment = await storage.getPaymentByOrderId(orderId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Update payment status
      await storage.updatePaymentStatus(orderId, status, transactionId);

      // If payment is successful, activate premium for 30 days
      if (status === 'completed' || status === 'success') {
        const user = await storage.getUserByVisitorId(payment.userId.toString());
        if (user) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          await storage.setUserPremium(user.visitorId, true, expiresAt);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Billing success page handler
  app.get('/api/billing/verify', async (req, res) => {
    try {
      const { orderId } = req.query;
      if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ error: 'orderId is required' });
      }

      const payment = await storage.getPaymentByOrderId(orderId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({ 
        status: payment.status,
        orderId: payment.orderId
      });
    } catch (error) {
      console.error('Verify payment error:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
