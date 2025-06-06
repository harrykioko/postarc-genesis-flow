
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuotaData {
  canGenerate: boolean;
  remainingQuota: number;
  totalQuota: number;
  plan: string;
  resetDate: string;
  currentUsage: number;
}

interface UseQuotaReturn extends QuotaData {
  loading: boolean;
  error: string | null;
  refreshQuota: () => void;
}

export const useQuota = (): UseQuotaReturn => {
  const { session, user } = useAuth();
  const [quotaData, setQuotaData] = useState<QuotaData>({
    canGenerate: false,
    remainingQuota: 0,
    totalQuota: 5,
    plan: 'free',
    resetDate: '',
    currentUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotaData = async () => {
    if (!user || !session) {
      setQuotaData({
        canGenerate: false,
        remainingQuota: 0,
        totalQuota: 5,
        plan: 'free',
        resetDate: '',
        currentUsage: 0,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('checkQuota', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (functionError) {
        throw functionError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setQuotaData({
        canGenerate: data.canGenerate || false,
        remainingQuota: data.remainingQuota || 0,
        totalQuota: data.totalQuota || 5,
        plan: data.plan || 'free',
        resetDate: data.resetDate || '',
        currentUsage: data.currentUsage || 0,
      });

    } catch (err) {
      console.error('Error fetching quota data:', err);
      setError('Failed to fetch quota information');
      
      // Set safe defaults on error
      setQuotaData({
        canGenerate: false,
        remainingQuota: 0,
        totalQuota: 5,
        plan: 'free',
        resetDate: '',
        currentUsage: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshQuota = () => {
    fetchQuotaData();
  };

  useEffect(() => {
    fetchQuotaData();
  }, [user, session]);

  return {
    ...quotaData,
    loading,
    error,
    refreshQuota,
  };
};
