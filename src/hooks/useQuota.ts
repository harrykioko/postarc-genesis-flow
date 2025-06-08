
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

      console.log('🔄 Calling check_user_quota RPC directly...');
      
      // Call the database function directly instead of the edge function
      const { data: quotaResult, error: rpcError } = await supabase
        .rpc('check_user_quota', { user_uuid: user.id });

      console.log('📊 Quota RPC result:', { data: quotaResult, error: rpcError });

      if (rpcError) {
        throw rpcError;
      }

      if (!quotaResult) {
        throw new Error('No quota data returned');
      }

      // Format the response to match our interface
      const canGenerate = quotaResult.remaining > 0 || quotaResult.remaining === -1;
      const resetDate = new Date(quotaResult.reset_date).toISOString();

      const formattedData = {
        canGenerate,
        remainingQuota: quotaResult.remaining === -1 ? 999 : quotaResult.remaining,
        totalQuota: quotaResult.quota === -1 ? 999 : quotaResult.quota,
        plan: quotaResult.tier || 'free',
        resetDate,
        currentUsage: quotaResult.used || 0,
      };

      console.log('✅ Quota data formatted:', formattedData);
      setQuotaData(formattedData);

    } catch (err) {
      console.error('❌ Error fetching quota data:', err);
      setError('Failed to fetch quota information');
      
      // Set safe defaults on error
      setQuotaData({
        canGenerate: false,
        remainingQuota: 0,
        totalQuota: 5,
        plan: 'free',
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        currentUsage: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshQuota = () => {
    console.log('🔄 Refreshing quota data...');
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
