
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
      const { data, error } = await supabase.functions.invoke('manage-templates', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching custom templates:', error);
      toast({
        title: "Failed to load templates",
        description: "Could not load your custom templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-templates', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { id: templateId },
      });

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== templateId));
      
      toast({
        title: "Template deleted",
        description: "Your custom template has been removed",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
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
