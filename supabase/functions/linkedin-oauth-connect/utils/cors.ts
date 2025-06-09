
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function handleCorsPreflightRequest() {
  return new Response(null, { 
    status: 200, 
    headers: corsHeaders 
  })
}

export function createErrorResponse(error: string, status: number = 400) {
  return new Response(
    JSON.stringify({ success: false, error }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

export function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
