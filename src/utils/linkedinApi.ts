
import { supabase } from '@/integrations/supabase/client';

export interface LinkedInPostResponse {
  success: boolean;
  linkedin_post_id?: string;
  linkedin_post_url?: string;
  error?: string;
}

export const postToLinkedIn = async (postId: string, content: string): Promise<LinkedInPostResponse> => {
  try {
    console.log('Posting to LinkedIn:', { postId, content: content.substring(0, 100) + '...' });
    
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

    console.log('LinkedIn posting response:', data);
    
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

export const initiateLinkedInOAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'profile email openid w_member_social'
      }
    });
    
    if (error) {
      console.error('LinkedIn OAuth error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('LinkedIn OAuth initiation error:', error);
    throw error;
  }
};
