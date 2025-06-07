
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
      console.log('🔄 Fetching custom templates from deployed edge function');
      
      const { data, error } = await supabase.functions.invoke('manage-templates', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('❌ Error fetching templates:', error);
        throw error;
      }

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
      
      const { error } = await supabase.functions.invoke('manage-templates', {
        body: { id: templateId },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('❌ Error deleting template:', error);
        throw error;
      }

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
