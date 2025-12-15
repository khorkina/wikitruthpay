import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { clientStorage, type UserAccount } from '@/lib/storage';

export function PremiumIndicator() {
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await clientStorage.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUser();
  }, []);

  if (!user?.subscription.isPremium) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-lime-100 text-lime-700 rounded-full text-xs font-medium">
      <Crown className="h-3 w-3 text-yellow-500" />
      <span>Premium</span>
    </div>
  );
}