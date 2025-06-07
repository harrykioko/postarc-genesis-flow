
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CustomTemplate {
  id: string;
  name: string;
  foundation_type: string;
  tone_attributes: string[];
  structure_type: string;
  industry_context: string | null;
  system_prompt: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomTemplates = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!session) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching custom templates using direct fetch');
      
      const response = await fetch(`https://obmrbvozmozvvxirrils.supabase.co/functions/v1/manage-templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Successfully fetched templates:', data);
      setTemplates(data?.templates || []);
    } catch (error) {
      console.error('❌ Failed to fetch custom templates:', error);
      // Don't show error toast on dashboard load - fail silently
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!session) return;

    try {
      console.log('🗑️ Deleting template:', templateId);
      
      const response = await fetch(`https://obmrbvozmozvvxirrils.supabase.co/functions/v1/manage-templates`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: templateId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Delete successful:', result);

      setTemplates(prev => prev.filter(template => template.id !== templateId));
      
      toast({
        title: "Template deleted",
        description: "Your custom template has been removed",
      });
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      toast({
        title: "Failed to delete template",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  const refreshTemplates = () => {
    fetchTemplates();
  };

  useEffect(() => {
    fetchTemplates();
  }, [session]);

  return {
    templates,
    loading,
    deleteTemplate,
    refreshTemplates
  };
};
