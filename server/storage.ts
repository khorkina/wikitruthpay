import { 
  comparisons, 
  searchSessions,
  highlights,
  users,
  payments,
  type Comparison, 
  type InsertComparison,
  type SearchSession,
  type InsertSearchSession,
  type Highlight,
  type InsertHighlight,
  type User,
  type InsertUser,
  type Payment,
  type InsertPayment
} from "@shared/schema";

export interface IStorage {
  // User operations
  getOrCreateUser(visitorId: string): Promise<User>;
  getUserByVisitorId(visitorId: string): Promise<User | undefined>;
  incrementUserGenerations(visitorId: string): Promise<User | undefined>;
  setUserPremium(visitorId: string, isPremium: boolean, expiresAt?: Date): Promise<User | undefined>;
  updateUserEmail(visitorId: string, email: string): Promise<User | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  updatePaymentStatus(orderId: string, status: string, maxelpayOrderId?: string): Promise<Payment | undefined>;
  
  // Comparison operations
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getComparison(id: number): Promise<Comparison | undefined>;
  
  // Search session operations
  createSearchSession(session: InsertSearchSession): Promise<SearchSession>;
  getSearchSession(sessionId: string): Promise<SearchSession | undefined>;
  updateSearchSession(sessionId: string, updates: Partial<InsertSearchSession>): Promise<SearchSession | undefined>;
  
  // Highlight operations
  createHighlight(highlight: InsertHighlight): Promise<Highlight>;
  getHighlightsByComparisonId(comparisonId: number): Promise<Highlight[]>;
  deleteHighlight(id: number): Promise<boolean>;
  deleteHighlightsByComparisonId(comparisonId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private comparisons: Map<number, Comparison>;
  private searchSessions: Map<string, SearchSession>;
  private highlights: Map<number, Highlight>;
  private usersMap: Map<string, User>;
  private paymentsMap: Map<string, Payment>;
  private currentComparisonId: number;
  private currentSessionId: number;
  private currentHighlightId: number;
  private currentUserId: number;
  private currentPaymentId: number;

  constructor() {
    this.comparisons = new Map();
    this.searchSessions = new Map();
    this.highlights = new Map();
    this.usersMap = new Map();
    this.paymentsMap = new Map();
    this.currentComparisonId = 1;
    this.currentSessionId = 1;
    this.currentHighlightId = 1;
    this.currentUserId = 1;
    this.currentPaymentId = 1;
  }

  async getOrCreateUser(visitorId: string): Promise<User> {
    let user = this.usersMap.get(visitorId);
    if (!user) {
      user = {
        id: this.currentUserId++,
        visitorId,
        email: null,
        generationsUsed: 0,
        isPremium: false,
        subscriptionId: null,
        subscriptionExpiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.usersMap.set(visitorId, user);
    }
    return user;
  }

  async getUserByVisitorId(visitorId: string): Promise<User | undefined> {
    return this.usersMap.get(visitorId);
  }

  async incrementUserGenerations(visitorId: string): Promise<User | undefined> {
    const user = this.usersMap.get(visitorId);
    if (!user) return undefined;
    user.generationsUsed++;
    user.updatedAt = new Date();
    return user;
  }

  async setUserPremium(visitorId: string, isPremium: boolean, expiresAt?: Date): Promise<User | undefined> {
    const user = this.usersMap.get(visitorId);
    if (!user) return undefined;
    user.isPremium = isPremium;
    user.subscriptionExpiresAt = expiresAt || null;
    user.updatedAt = new Date();
    return user;
  }

  async updateUserEmail(visitorId: string, email: string): Promise<User | undefined> {
    const user = this.usersMap.get(visitorId);
    if (!user) return undefined;
    user.email = email;
    user.updatedAt = new Date();
    return user;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      id: this.currentPaymentId++,
      userId: insertPayment.userId,
      orderId: insertPayment.orderId,
      amount: insertPayment.amount,
      currency: insertPayment.currency || 'USD',
      status: insertPayment.status || 'pending',
      maxelpayOrderId: insertPayment.maxelpayOrderId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.paymentsMap.set(insertPayment.orderId, payment);
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    return this.paymentsMap.get(orderId);
  }

  async updatePaymentStatus(orderId: string, status: string, maxelpayOrderId?: string): Promise<Payment | undefined> {
    const payment = this.paymentsMap.get(orderId);
    if (!payment) return undefined;
    payment.status = status;
    if (maxelpayOrderId) payment.maxelpayOrderId = maxelpayOrderId;
    payment.updatedAt = new Date();
    return payment;
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const id = this.currentComparisonId++;
    const comparison: Comparison = { 
      id,
      articleTitle: insertComparison.articleTitle,
      selectedLanguages: insertComparison.selectedLanguages,
      outputLanguage: insertComparison.outputLanguage,
      comparisonResult: insertComparison.comparisonResult || null,
      isFunnyMode: insertComparison.isFunnyMode || null,
      isPremium: insertComparison.isPremium || null,
      createdAt: new Date()
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }

  async createSearchSession(insertSession: InsertSearchSession): Promise<SearchSession> {
    const id = this.currentSessionId++;
    const session: SearchSession = { 
      id,
      sessionId: insertSession.sessionId,
      searchQuery: insertSession.searchQuery || null,
      selectedArticle: insertSession.selectedArticle || null,
      availableLanguages: insertSession.availableLanguages || null,
      createdAt: new Date()
    };
    this.searchSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getSearchSession(sessionId: string): Promise<SearchSession | undefined> {
    return this.searchSessions.get(sessionId);
  }

  async updateSearchSession(sessionId: string, updates: Partial<InsertSearchSession>): Promise<SearchSession | undefined> {
    const existing = this.searchSessions.get(sessionId);
    if (!existing) return undefined;
    
    const updated: SearchSession = { ...existing, ...updates };
    this.searchSessions.set(sessionId, updated);
    return updated;
  }

  async createHighlight(insertHighlight: InsertHighlight): Promise<Highlight> {
    const id = this.currentHighlightId++;
    const highlight: Highlight = {
      id,
      comparisonId: insertHighlight.comparisonId,
      startOffset: insertHighlight.startOffset,
      endOffset: insertHighlight.endOffset,
      color: insertHighlight.color,
      excerpt: insertHighlight.excerpt,
      createdAt: new Date()
    };
    this.highlights.set(id, highlight);
    return highlight;
  }

  async getHighlightsByComparisonId(comparisonId: number): Promise<Highlight[]> {
    const results: Highlight[] = [];
    this.highlights.forEach((highlight) => {
      if (highlight.comparisonId === comparisonId) {
        results.push(highlight);
      }
    });
    return results.sort((a, b) => a.startOffset - b.startOffset);
  }

  async deleteHighlight(id: number): Promise<boolean> {
    return this.highlights.delete(id);
  }

  async deleteHighlightsByComparisonId(comparisonId: number): Promise<boolean> {
    const toDelete: number[] = [];
    this.highlights.forEach((highlight, id) => {
      if (highlight.comparisonId === comparisonId) {
        toDelete.push(id);
      }
    });
    toDelete.forEach(id => this.highlights.delete(id));
    return toDelete.length > 0;
  }
}

export const storage = new MemStorage();
