import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Database schema with premium subscription support
export interface UserAccount {
  id: string;
  createdAt: string;
  preferences: {
    defaultLanguage: string;
    theme: 'light' | 'dark';
  };
  subscription: {
    isPremium: boolean;
    subscriptionDate?: string;
    expiryDate?: string;
  };
}

export interface StorageComparisonResult {
  id: string;
  userId: string;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  baseLanguage: string;
  comparisonResult: string;
  isFunnyMode: boolean;
  isPremium: boolean;
  createdAt: string;
  articles: Array<{
    language: string;
    title: string;
    content: string;
    contentLength: number;
  }>;
}

export interface SearchSession {
  id: string;
  userId: string;
  searchQuery?: string;
  selectedArticle?: any;
  availableLanguages?: Array<{
    lang: string;
    title: string;
    url: string;
  }>;
  createdAt: string;
}

export interface LocalHighlight {
  id: string;
  comparisonId: string;
  startOffset: number;
  endOffset: number;
  color: string;
  excerpt: string;
  createdAt: string;
}

class ClientStorage {
  private db: IDBPDatabase | null = null;
  private dbName = 'WikiTruthDB';
  private dbVersion = 4; // Incremented for highlights support

  async init(): Promise<void> {
    this.db = await openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        // User accounts store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        // Comparisons store
        if (!db.objectStoreNames.contains('comparisons')) {
          const comparisonsStore = db.createObjectStore('comparisons', { keyPath: 'id' });
          comparisonsStore.createIndex('userId', 'userId', { unique: false });
          comparisonsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Search sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('userId', 'userId', { unique: false });
        }

        // Highlights store
        if (!db.objectStoreNames.contains('highlights')) {
          const highlightsStore = db.createObjectStore('highlights', { keyPath: 'id' });
          highlightsStore.createIndex('comparisonId', 'comparisonId', { unique: false });
        }
      },
    });
  }

  // User account management - simplified
  async getCurrentUser(): Promise<UserAccount> {
    if (!this.db) await this.init();
    
    // Check localStorage for existing user ID
    let userId = localStorage.getItem('wikiTruthUserId');
    
    if (!userId) {
      // Create new user - all users are automatically premium
      userId = uuidv4();
      localStorage.setItem('wikiTruthUserId', userId);
      
      const newUser: UserAccount = {
        id: userId,
        createdAt: new Date().toISOString(),
        preferences: {
          defaultLanguage: 'en',
          theme: 'light'
        },
        subscription: {
          isPremium: true
        }
      };
      
      await this.db!.put('users', newUser);
      return newUser;
    }

    // Get existing user
    const user = await this.db!.get('users', userId);
    if (user) {
      // All users are automatically premium - update if needed
      const cleanUser: UserAccount = {
        id: user.id,
        createdAt: user.createdAt,
        preferences: user.preferences || {
          defaultLanguage: 'en',
          theme: 'light'
        },
        subscription: {
          isPremium: true
        }
      };
      await this.db!.put('users', cleanUser);
      return cleanUser;
    }

    // User ID exists in localStorage but not in IndexedDB - recreate as premium
    const recreatedUser: UserAccount = {
      id: userId,
      createdAt: new Date().toISOString(),
      preferences: {
        defaultLanguage: 'en',
        theme: 'light'
      },
      subscription: {
        isPremium: true
      }
    };
    
    await this.db!.put('users', recreatedUser);
    return recreatedUser;
  }

  async updateUser(updates: Partial<UserAccount>): Promise<UserAccount> {
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser, ...updates };
    await this.db!.put('users', updatedUser);
    return updatedUser;
  }

  // Comparison management
  async saveComparison(comparison: Omit<StorageComparisonResult, 'id' | 'userId' | 'createdAt'>): Promise<StorageComparisonResult> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    const fullComparison: StorageComparisonResult = {
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...comparison
    };

    await this.db!.put('comparisons', fullComparison);
    return fullComparison;
  }

  async getComparison(id: string): Promise<StorageComparisonResult | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('comparisons', id);
  }

  async getUserComparisons(): Promise<StorageComparisonResult[]> {
    if (!this.db) await this.init();
    const user = await this.getCurrentUser();
    
    const tx = this.db!.transaction('comparisons', 'readonly');
    const index = tx.store.index('userId');
    const comparisons = await index.getAll(user.id);
    
    return comparisons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteComparison(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.deleteHighlightsByComparisonId(id);
    await this.db!.delete('comparisons', id);
  }

  // Session management
  async saveSession(session: Omit<SearchSession, 'id' | 'userId' | 'createdAt'>): Promise<SearchSession> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    const fullSession: SearchSession = {
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...session
    };

    await this.db!.put('sessions', fullSession);
    return fullSession;
  }

  async getSession(id: string): Promise<SearchSession | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('sessions', id);
  }

  async updateSession(id: string, updates: Partial<SearchSession>): Promise<SearchSession | undefined> {
    if (!this.db) await this.init();
    const existing = await this.getSession(id);
    if (!existing) return undefined;

    const updated: SearchSession = { ...existing, ...updates };
    await this.db!.put('sessions', updated);
    return updated;
  }

  // Data export and management
  async exportAllData(): Promise<{
    user: UserAccount;
    comparisons: StorageComparisonResult[];
    sessions: SearchSession[];
  }> {
    const user = await this.getCurrentUser();
    const comparisons = await this.getUserComparisons();
    const sessions = await this.getAllSessions();
    
    return { user, comparisons, sessions };
  }

  async getAllSessions(): Promise<SearchSession[]> {
    if (!this.db) await this.init();
    const user = await this.getCurrentUser();
    
    const tx = this.db!.transaction('sessions', 'readonly');
    const index = tx.store.index('userId');
    return await index.getAll(user.id);
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(['users', 'comparisons', 'sessions', 'highlights'], 'readwrite');
    await Promise.all([
      tx.objectStore('users').clear(),
      tx.objectStore('comparisons').clear(),
      tx.objectStore('sessions').clear(),
      tx.objectStore('highlights').clear()
    ]);
    
    localStorage.removeItem('wikiTruthUserId');
  }

  // Premium subscription management
  async activatePremiumSubscription(): Promise<UserAccount> {
    const currentUser = await this.getCurrentUser();
    const subscriptionDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    
    const updatedUser = await this.updateUser({
      subscription: {
        isPremium: true,
        subscriptionDate,
        expiryDate
      }
    });
    
    return updatedUser;
  }

  async checkSubscriptionStatus(): Promise<{ isValid: boolean; daysRemaining?: number }> {
    // All users are automatically premium - always return valid
    return { isValid: true };
  }

  async getVisitorId(): Promise<string> {
    let visitorId = localStorage.getItem('wikiTruthVisitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('wikiTruthVisitorId', visitorId);
    }
    return visitorId;
  }

  async deactivateSubscription(): Promise<UserAccount> {
    return await this.updateUser({
      subscription: {
        isPremium: false
      }
    });
  }

  // Highlights management
  async saveHighlight(highlight: Omit<LocalHighlight, 'id' | 'createdAt'>): Promise<LocalHighlight> {
    if (!this.db) await this.init();
    
    const fullHighlight: LocalHighlight = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...highlight
    };

    await this.db!.put('highlights', fullHighlight);
    return fullHighlight;
  }

  async getHighlightsByComparisonId(comparisonId: string): Promise<LocalHighlight[]> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('highlights', 'readonly');
    const index = tx.store.index('comparisonId');
    const highlights = await index.getAll(comparisonId);
    
    return highlights.sort((a, b) => a.startOffset - b.startOffset);
  }

  async deleteHighlight(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('highlights', id);
  }

  async deleteHighlightsByComparisonId(comparisonId: string): Promise<void> {
    if (!this.db) await this.init();
    
    const highlights = await this.getHighlightsByComparisonId(comparisonId);
    const tx = this.db!.transaction('highlights', 'readwrite');
    
    for (const highlight of highlights) {
      await tx.store.delete(highlight.id);
    }
    
    await tx.done;
  }
}

export const clientStorage = new ClientStorage();