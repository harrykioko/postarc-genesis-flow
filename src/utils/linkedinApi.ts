
import { supabase } from '@/integrations/supabase/client';

export interface LinkedInPostResponse {
  success: boolean;
  linkedin_post_id?: string;
  linkedin_post_url?: string;
  error?: string;
}

export interface LinkedInProfile {
  linkedin_member_id: string;
  name: string;
  profile_url: string;
  profile_image_url?: string;
  connected_at: string;
}

export interface LinkedInConnectionStatus {
  success: boolean;
  connection_status: 'connected' | 'disconnected' | 'expired';
  profile?: LinkedInProfile;
  token_expires_at?: string;
  error?: string;
}

// Manual LinkedIn OAuth flow using our edge function
export const initiateLinkedInOAuth = async (): Promise<{ auth_url: string; state: string }> => {
  try {
    console.log('Initiating LinkedIn OAuth...');
    
    const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
      body: { action: 'initiate' },
      method: 'POST'
    });
    
    console.log('OAuth initiation response:', { data, error });
    
    if (error) {
      console.error('LinkedIn OAuth initiation error:', error);
      throw new Error(error.message || 'Failed to initiate LinkedIn OAuth');
    }

    if (!data?.success || !data?.auth_url) {
      console.error('Invalid OAuth response:', data);
      throw new Error(data?.error || 'Invalid response from LinkedIn OAuth service');
    }

    console.log('LinkedIn OAuth URL generated successfully');
    return {
      auth_url: data.auth_url,
      state: data.state
    };
  } catch (error: any) {
    console.error('LinkedIn OAuth initiation error:', error);
    throw new Error(error.message || 'Failed to initiate LinkedIn OAuth');
  }
};

// Handle OAuth callback - exchange code for tokens
export const handleLinkedInCallback = async (code: string, state: string): Promise<LinkedInProfile> => {
  try {
    console.log('Processing LinkedIn OAuth callback...', {
      codeLength: code?.length,
      stateLength: state?.length
    });
    
    if (!code || !state) {
      throw new Error('Missing required OAuth parameters');
    }
    
    const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
      body: { action: 'callback', code, state },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Callback response:', { data, error });
    
    if (error) {
      console.error('LinkedIn callback error:', error);
      throw new Error(error.message || 'Failed to process LinkedIn callback');
    }

    if (!data?.success) {
      console.error('Callback failed:', data);
      throw new Error(data?.error || 'LinkedIn connection failed');
    }

    if (!data?.profile) {
      console.error('No profile data received:', data);
      throw new Error('Failed to retrieve LinkedIn profile data');
    }

    console.log('LinkedIn connection successful');
    return data.profile;
  } catch (error: any) {
    console.error('LinkedIn callback processing error:', error);
    throw new Error(error.message || 'Failed to connect LinkedIn account');
  }
};

// Check LinkedIn connection status
export const checkLinkedInConnectionStatus = async (): Promise<LinkedInConnectionStatus> => {
  try {
    console.log('Checking LinkedIn connection status...');
    
    const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
      body: { action: 'status' },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (error) {
      console.error('LinkedIn status check error:', error);
      return {
        success: false,
        connection_status: 'disconnected',
        error: error.message
      };
    }

    console.log('LinkedIn status:', data?.connection_status);
    return data;
  } catch (error: any) {
    console.error('LinkedIn status check error:', error);
    return {
      success: false,
      connection_status: 'disconnected',
      error: error.message
    };
  }
};

// Disconnect LinkedIn
export const disconnectLinkedIn = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Disconnecting LinkedIn...');
    
    const { data, error } = await supabase.functions.invoke('linkedin-oauth-connect', {
      body: { action: 'disconnect' },
      method: 'POST'
    });
    
    if (error) {
      console.error('LinkedIn disconnect error:', error);
      return { success: false, error: error.message };
    }

    console.log('LinkedIn disconnected successfully');
    return { success: true };
  } catch (error: any) {
    console.error('LinkedIn disconnect error:', error);
    return { success: false, error: error.message };
  }
};

// Post to LinkedIn (existing function, updated to use stored tokens)
export const postToLinkedIn = async (postId: string, content: string): Promise<LinkedInPostResponse> => {
  try {
    console.log('Posting to LinkedIn:', { postId, contentLength: content?.length });
    
    const { data, error } = await supabase.functions.invoke('post-to-linkedin', {
      body: { 
        post_id: postId, 
        content: content 
      }
    });
    
    if (error) {
      console.error('LinkedIn posting error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to post to LinkedIn' 
      };
    }

    console.log('LinkedIn posting successful');
    
    return {
      success: true,
      linkedin_post_id: data?.linkedin_post_id,
      linkedin_post_url: data?.linkedin_post_url
    };
  } catch (error: any) {
    console.error('LinkedIn posting error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to post to LinkedIn' 
    };
  }
};
