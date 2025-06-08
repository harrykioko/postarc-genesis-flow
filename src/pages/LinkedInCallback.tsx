
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleLinkedInCallback } from '@/utils/linkedinApi';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkLinkedInConnection } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('LinkedIn callback params:', { code: !!code, state: !!state, error, errorDescription });

        if (error) {
          throw new Error(errorDescription || `LinkedIn OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        setMessage('Connecting to LinkedIn...');
        
        // Handle the callback through our edge function
        await handleLinkedInCallback(code, state);
        
        setMessage('LinkedIn connected successfully!');
        setStatus('success');
        
        // Refresh the connection status in AuthContext
        await checkLinkedInConnection();
        
        toast({
          title: "LinkedIn Connected",
          description: "Your LinkedIn account has been successfully connected.",
        });

        // Redirect back to settings after a short delay
        setTimeout(() => {
          navigate('/settings?tab=connections');
        }, 2000);

      } catch (error: any) {
        console.error('LinkedIn callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect LinkedIn account');
        
        toast({
          title: "Connection Failed",
          description: error.message || 'Failed to connect LinkedIn account',
          variant: "destructive"
        });

        // Redirect back to settings after a short delay
        setTimeout(() => {
          navigate('/settings?tab=connections');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, checkLinkedInConnection, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAFF] via-[#ECF6FF] to-[#FFFFFF] flex items-center justify-center">
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
        
        <p className="text-slate text-sm">
          {message}
        </p>
        
        {status !== 'loading' && (
          <p className="text-xs text-slate mt-4">
            Redirecting you back to settings...
          </p>
        )}
      </div>
    </div>
  );
};

export default LinkedInCallback;
