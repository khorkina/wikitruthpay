# Wiki Truth - Privacy-First Wikipedia Comparison Platform

## Overview
Wiki Truth is a freemium web application designed to allow users to compare Wikipedia articles across multiple languages using artificial intelligence. The platform offers a free tier utilizing Meta Llama AI analysis and a premium tier ($10/month) with OpenAI GPT-4o analysis and enhanced features. Emphasizing privacy, all user data is stored locally in the browser. The core purpose is to reveal how topics are presented differently across various linguistic and cultural contexts.

## User Preferences
Preferred communication style: Simple, everyday language.

### Subscription Flow Preferences
- Free users should not see which AI model is being used (hide technical details)
- Don't interrupt users with plan selection during comparison workflow
- Auto-start comparisons with user's current plan (free or premium)
- Provide optional upgrade button that doesn't disrupt user experience
- Use demo payment links for Smart Glocal integration testing

## System Architecture

### UI/UX Decisions
- **Design System**: Wikipedia-inspired design system with Tailwind CSS.
- **Component Library**: Radix UI primitives with shadcn/ui components.
- **Responsiveness**: Mobile-first approach with grid-based layouts.
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support.
- **Notifications**: Toast notifications for user feedback.
- **Loading States**: Skeleton loading and progress indicators.
- **Premium Indicators**: Green premium badges and crown icons for visual premium status.
- **Social Sharing**: Round circular buttons with platform labels and unique designs.
- **Dark Mode**: Toggle between light and dark themes with localStorage persistence.
- **Donation Banner**: Wikipedia-style carousel banner with Ko-Fi donation link (no branding visible).
- **Suggest Improvement**: Footer button linking to email form (worldtruthfoundation@gmail.com).

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query for server state, Vite as build tool.
- **Backend**: Node.js with Express.js for static file serving only (minimal server).
- **Data Storage**: IndexedDB for structured data, localStorage for UUID-based accounts and subscription tracking. All data is client-side; no server-side data storage or tracking.
- **AI Comparison Engine**: Integrates with OpenRouter.ai (Meta Llama 3.1 8B Instruct for free tier) and OpenAI (GPT-4o for premium tier). Supports academic and "funny" comparison modes.
- **Search and Discovery**: Direct API integration with Wikipedia's OpenSearch and LangLinks APIs for real-time, debounced search with autocomplete and multi-language support (35+ languages). Filters out disambiguation pages and low-content articles.
- **Export and Sharing**: DOCX generation for comparison reports and URL-based sharing of results.
- **Subscription Management**: Browser-based premium subscription with 30-day validation, integrated with NowPayments.

### Feature Specifications
- **Freemium Model**: Free (Llama-powered) and Premium (GPT-4o powered) tiers.
- **Privacy-First**: All user and comparison data stored locally in the browser (IndexedDB, localStorage).
- **Multi-language Comparison**: Supports comparing articles across 2-5 user-selected languages.
- **Cultural Analysis**: AI focuses on factual differences, framing variations, and cultural perspectives.
- **Payment Processing**: NowPayments integration for premium subscriptions.
- **User Accounts**: UUID-based accounts created and managed locally in the browser.

## External Dependencies

### APIs and Services
- **Wikipedia API**: For article search, language links, and content retrieval.
- **OpenRouter.ai API**: For free tier AI comparison and analysis (Meta Llama models).
- **OpenAI API**: For premium tier AI comparison and analysis (GPT-4o).
- **NowPayments**: For cryptocurrency payment processing and premium subscription management.
- **AllOrigins**: A CORS proxy service used for bypassing browser CORS restrictions with Wikipedia.

### Libraries and Frameworks
- **React**: Frontend framework.
- **TypeScript**: Programming language.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Headless component primitives.
- **Wouter**: Lightweight client-side routing.
- **TanStack Query**: Server state management.
- **idb**: Library for IndexedDB interactions.
- **docx**: Library for DOCX document generation.

### Development Tools
- **Vite**: Frontend build tool.
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Minimal backend framework for static file serving.
- **tsx**: For TypeScript execution in development.