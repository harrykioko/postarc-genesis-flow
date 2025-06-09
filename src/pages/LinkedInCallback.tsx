// src/pages/LinkedInCallback.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleLinkedInCallback } from '@/utils/linkedinApi';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkLinkedInConnection } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleCallback = async (isRetry = false) => {
    try {
      // Extract and log all URL parameters for debugging
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      const debug = {
        url: window.location.href,
        code: code ? `${code.substring(0, 10)}...` : null,
        state: state ? `${state.substring(0, 10)}...` : null,
        error,
        errorDescription,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      setDebugInfo(debug);
      console.log('LinkedIn callback debug info:', debug);

      if (error) {
        throw new Error(errorDescription || `LinkedIn OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received from LinkedIn');
      }

      if (!state) {
        throw new Error('No state parameter received from LinkedIn');
      }

      setMessage(isRetry ? 'Retrying LinkedIn connection...' : 'Processing LinkedIn authorization...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 30000);
      });
      
      const callbackPromise = handleLinkedInCallback(code, state);
      
      await Promise.race([callbackPromise, timeoutPromise]);
      
      setMessage('LinkedIn connected successfully! Updating your profile...');
      setStatus('success');
      
      // IMPORTANT: Force refresh the LinkedIn connection status
      console.log('Refreshing LinkedIn connection status...');
      await checkLinkedInConnection();
      
      // Add a small delay to ensure the state is updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "LinkedIn Connected",
        description: "Your LinkedIn account has been successfully connected.",
      });

      // Redirect after success with a slight delay to ensure state updates
      setTimeout(() => {
        navigate('/settings?tab=connections', { replace: true });
      }, 1500);

    } catch (error: any) {
      console.error('LinkedIn callback error:', error);
      setStatus('error');
      
      let errorMessage = error.message || 'Failed to connect LinkedIn account';
      
      // Provide more specific error messages
      if (error.message?.includes('timeout')) {
        errorMessage = 'Connection timed out. Please try again.';
      } else if (error.message?.includes('state')) {
        errorMessage = 'Security validation failed. Please try connecting again.';
      } else if (error.message?.includes('token')) {
        errorMessage = 'Failed to exchange authorization code. Please try again.';
      }
      
      setMessage(errorMessage);
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setStatus('loading');
    handleCallback(true);
  };

  const handleGoBack = () => {
    navigate('/settings?tab=connections', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAFF] via-[#ECF6FF] to-[#FFFFFF] flex items-center justify-center p-4">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <Loader2 className="w-12 h-12 text-[#0077B5] animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-midnight mb-2">
          {status === 'loading' && 'Connecting LinkedIn...'}
          {status === 'success' && 'LinkedIn Connected!'}
          {status === 'error' && 'Connection Failed'}
        </h2>
        
        <p className="text-slate text-sm mb-4">
          {message}
        </p>
        
        {status === 'error' && (
          <div className="space-y-3">
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="bg-[#0077B5] hover:bg-[#005885]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
              </Button>
              <Button 
                onClick={handleGoBack}
                variant="outline"
              >
                Go Back
              </Button>
            </div>
            
            {retryCount >= 2 && (
              <details className="text-xs text-left bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <pre className="mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
        
        {status !== 'error' && (
          <p className="text-xs text-slate mt-4">
            {status === 'loading' ? 'Please wait...' : 'Updating your settings...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LinkedInCallback;