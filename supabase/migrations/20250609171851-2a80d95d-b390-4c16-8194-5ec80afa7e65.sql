
-- Update the check_user_quota function to use the correct schema
CREATE OR REPLACE FUNCTION public.check_user_quota(user_uuid uuid DEFAULT auth.uid())
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    user_tier text;
    monthly_usage integer;
    quota_limit integer;
    remaining_quota integer;
    reset_date date;
BEGIN
    -- Get user tier from role column or subscription
    SELECT u.role INTO user_tier
    FROM users u
    WHERE u.id = user_uuid;
    
    -- Check if user has an active subscription that overrides the role
    SELECT s.tier INTO user_tier
    FROM subscriptions s
    WHERE s.user_id = user_uuid 
    AND s.status = 'active'
    ORDER BY s.current_period_end DESC
    LIMIT 1;
    
    -- If no subscription found, fall back to user role
    IF user_tier IS NULL THEN
        SELECT u.role INTO user_tier
        FROM users u
        WHERE u.id = user_uuid;
    END IF;
    
    -- Set quota limits based on tier
    IF user_tier = 'pro' THEN
        quota_limit := 15;
    ELSIF user_tier = 'legend' THEN
        quota_limit := -1; -- unlimited
    ELSE
        quota_limit := 5; -- free tier
    END IF;
    
    -- Get monthly usage
    SELECT get_user_monthly_usage(user_uuid) INTO monthly_usage;
    
    -- Calculate remaining quota
    IF quota_limit = -1 THEN
        remaining_quota := -1; -- unlimited
    ELSE
        remaining_quota := GREATEST(0, quota_limit - monthly_usage);
    END IF;
    
    -- Calculate reset date (first day of next month)
    reset_date := date_trunc('month', CURRENT_DATE) + interval '1 month';
    
    RETURN json_build_object(
        'tier', COALESCE(user_tier, 'free'),
        'used', monthly_usage,
        'quota', quota_limit,
        'remaining', remaining_quota,
        'reset_date', reset_date
    );
END;
$function$
