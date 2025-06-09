
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

      console.log('🔄 Fetching quota data for user:', user.id);

      // Call the updated RPC function
      const { data: quotaResult, error: quotaError } = await supabase
        .rpc('check_user_quota', { user_uuid: user.id });

      console.log('📊 Quota RPC result:', { data: quotaResult, error: quotaError });

      if (quotaError) {
        console.error('❌ Quota check error:', quotaError);
        throw quotaError;
      }

      // Parse the response from the updated function
      const quota = quotaResult as {
        tier: string;
        used: number;
        quota: number;
        remaining: number;
        reset_date: string;
      };

      // Convert the data to our expected format
      const canGenerate = quota.remaining > 0 || quota.remaining === -1;
      const resetDate = new Date(quota.reset_date).toISOString();

      const formattedData = {
        canGenerate,
        remainingQuota: quota.remaining === -1 ? 999 : quota.remaining,
        totalQuota: quota.quota === -1 ? 999 : quota.quota,
        plan: quota.tier || 'free',
        resetDate,
        currentUsage: quota.used,
      };

      console.log('✅ Formatted quota data:', formattedData);
      setQuotaData(formattedData);

    } catch (err: any) {
      console.error('💥 Error fetching quota data:', err);
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
    console.log('🔄 Manually refreshing quota data...');
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
