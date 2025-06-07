export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      custom_templates: {
        Row: {
          created_at: string
          foundation_type: string
          id: string
          industry_context: string | null
          is_active: boolean
          name: string
          structure_type: string
          system_prompt: string
          tone_attributes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          foundation_type: string
          id?: string
          industry_context?: string | null
          is_active?: boolean
          name: string
          structure_type: string
          system_prompt: string
          tone_attributes?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          foundation_type?: string
          id?: string
          industry_context?: string | null
          is_active?: boolean
          name?: string
          structure_type?: string
          system_prompt?: string
          tone_attributes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_usage: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          last_used_at: string | null
          session_id: string
          usage_count: number | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_used_at?: string | null
          session_id: string
          usage_count?: number | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_used_at?: string | null
          session_id?: string
          usage_count?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          emojis_enabled: boolean | null
          hashtags_enabled: boolean | null
          id: string
          length_setting: string | null
          prompt_topic: string | null
          scraped_data: Json | null
          template_used: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          emojis_enabled?: boolean | null
          hashtags_enabled?: boolean | null
          id?: string
          length_setting?: string | null
          prompt_topic?: string | null
          scraped_data?: Json | null
          template_used?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          emojis_enabled?: boolean | null
          hashtags_enabled?: boolean | null
          id?: string
          length_setting?: string | null
          prompt_topic?: string | null
          scraped_data?: Json | null
          template_used?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          id: string
          monthly_quota: number | null
          status: string
          stripe_subscription: string
          tier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_period_end?: string | null
          id?: string
          monthly_quota?: number | null
          status: string
          stripe_subscription: string
          tier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_period_end?: string | null
          id?: string
          monthly_quota?: number | null
          status?: string
          stripe_subscription?: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_templates: {
        Row: {
          created_at: string | null
          description: string | null
          example_post: string | null
          id: string
          name: string
          system_prompt: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          example_post?: string | null
          id?: string
          name: string
          system_prompt: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          example_post?: string | null
          id?: string
          name?: string
          system_prompt?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          brand_voice: string | null
          created_at: string | null
          email: string
          id: string
          job_title: string | null
          linkedin_head: string | null
          name: string | null
          profile_complete: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          brand_voice?: string | null
          created_at?: string | null
          email: string
          id?: string
          job_title?: string | null
          linkedin_head?: string | null
          name?: string | null
          profile_complete?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          brand_voice?: string | null
          created_at?: string | null
          email?: string
          id?: string
          job_title?: string | null
          linkedin_head?: string | null
          name?: string | null
          profile_complete?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_quota: {
        Args: { user_uuid: string }
        Returns: Json
      }
      get_user_monthly_usage: {
        Args: { user_uuid: string }
        Returns: number
      }
      is_profile_complete: {
        Args: { user_row: Database["public"]["Tables"]["users"]["Row"] }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
