
import { supabase } from '../utils/auth.ts'
import { createSuccessResponse, createErrorResponse } from '../utils/cors.ts'

export async function handlePostToLinkedIn(userId: string, body: any) {
  const { post_id, content } = body

  if (!post_id || !content) {
    return createErrorResponse('Missing post_id or content', 400)
  }

  try {
    // Get user's LinkedIn access token
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('linkedin_access_token, linkedin_member_id, linkedin_token_expires_at')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error('❌ Failed to fetch user data:', userError)
      return createErrorResponse('Failed to fetch user data')
    }

    if (!userData.linkedin_access_token || !userData.linkedin_member_id) {
      return createErrorResponse('LinkedIn not connected. Please connect your LinkedIn account first.')
    }

    // Check if token is expired
    const tokenExpiry = new Date(userData.linkedin_token_expires_at)
    if (tokenExpiry < new Date()) {
      return createErrorResponse('LinkedIn token expired. Please reconnect your LinkedIn account.')
    }

    // Post to LinkedIn API
    const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.linkedin_access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: `urn:li:person:${userData.linkedin_member_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    })

    if (!linkedinResponse.ok) {
      const errorText = await linkedinResponse.text()
      console.error('❌ LinkedIn API error:', errorText)
      return createErrorResponse('Failed to post to LinkedIn')
    }

    const linkedinData = await linkedinResponse.json()
    console.log('✅ Posted to LinkedIn successfully:', linkedinData.id)

    // Extract post ID and create post URL
    const linkedinPostId = linkedinData.id
    const linkedinPostUrl = `https://www.linkedin.com/feed/update/${linkedinPostId}`

    // Update the post record with LinkedIn data
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        linkedin_post_id: linkedinPostId,
        linkedin_post_url: linkedinPostUrl,
        posted_to_linkedin_at: new Date().toISOString()
      })
      .eq('id', post_id)
      .eq('user_id', userId)

    if (updateError) {
      console.error('❌ Failed to update post record:', updateError)
      // Don't return error here since the LinkedIn post was successful
    }

    return createSuccessResponse({
      linkedin_post_id: linkedinPostId,
      linkedin_post_url: linkedinPostUrl
    })

  } catch (error: any) {
    console.error('❌ Unexpected error posting to LinkedIn:', error)
    return createErrorResponse('Failed to post to LinkedIn')
  }
}
