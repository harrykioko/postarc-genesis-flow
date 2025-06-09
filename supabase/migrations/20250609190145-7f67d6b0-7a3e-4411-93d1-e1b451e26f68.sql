
-- Drop the existing constraint that doesn't include business_representative
ALTER TABLE public.custom_templates 
DROP CONSTRAINT custom_templates_foundation_type_check;

-- Add the updated constraint with business_representative included
ALTER TABLE public.custom_templates 
ADD CONSTRAINT custom_templates_foundation_type_check 
CHECK (foundation_type = ANY (ARRAY[
    'fresh'::text, 
    'consultant'::text, 
    'founder'::text, 
    'sales'::text, 
    'hr'::text, 
    'vc'::text,
    'business_representative'::text
]));
