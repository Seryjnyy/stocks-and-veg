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
      group: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      group_user: {
        Row: {
          created_at: string
          day_full_completes: number
          day_partial_completes: number
          group_id: string
          id: string
          tasks_completed: number
          tasks_not_completed: number
          times_being_a_target: number
          times_tomatoed: number
          tomatoes: number
          tomatoes_received: number
          tomatoes_thrown: number
          total_tomatos: number
          user_id: string
          xp: number
          get_group_user_profile: unknown | null
        }
        Insert: {
          created_at?: string
          day_full_completes?: number
          day_partial_completes?: number
          group_id: string
          id?: string
          tasks_completed?: number
          tasks_not_completed?: number
          times_being_a_target?: number
          times_tomatoed?: number
          tomatoes?: number
          tomatoes_received?: number
          tomatoes_thrown?: number
          total_tomatos?: number
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          day_full_completes?: number
          day_partial_completes?: number
          group_id?: string
          id?: string
          tasks_completed?: number
          tasks_not_completed?: number
          times_being_a_target?: number
          times_tomatoed?: number
          tomatoes?: number
          tomatoes_received?: number
          tomatoes_thrown?: number
          total_tomatos?: number
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_user_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_link: {
        Row: {
          created_at: string
          expires_at: string
          group_id: string
          id: string
          token: string
          used: boolean
        }
        Insert: {
          created_at?: string
          expires_at: string
          group_id: string
          id?: string
          token: string
          used?: boolean
        }
        Update: {
          created_at?: string
          expires_at?: string
          group_id?: string
          id?: string
          token?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "invite_links_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          created_at: string
          id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      task: {
        Row: {
          created_at: string
          desc: string
          group_id: string
          group_user_id: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desc: string
          group_id: string
          group_user_id: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          desc?: string
          group_id?: string
          group_user_id?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_group_user_id_fkey"
            columns: ["group_user_id"]
            isOneToOne: false
            referencedRelation: "group_user"
            referencedColumns: ["id"]
          },
        ]
      }
      task_completion: {
        Row: {
          completed_at: string
          date: string
          group_id: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          date?: string
          group_id: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          date?: string
          group_id?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completion_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completion_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          },
        ]
      }
      test_realtime: {
        Row: {
          created_at: string
          group_id: string
          group_user_id: string
          id: string
          message: string
          tomato_target_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          group_user_id: string
          id?: string
          message: string
          tomato_target_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          group_user_id?: string
          id?: string
          message?: string
          tomato_target_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_realtime_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_realtime_group_user_id_fkey"
            columns: ["group_user_id"]
            isOneToOne: false
            referencedRelation: "group_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_realtime_tomato_target_id_fkey"
            columns: ["tomato_target_id"]
            isOneToOne: false
            referencedRelation: "tomato_target"
            referencedColumns: ["id"]
          },
        ]
      }
      tomato_target: {
        Row: {
          created_at: string
          group_id: string
          group_user_id: string | null
          id: string
          tomatoes_received: number
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          group_user_id?: string | null
          id?: string
          tomatoes_received?: number
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          group_user_id?: string | null
          id?: string
          tomatoes_received?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tomato_target_group_user_id_fkey"
            columns: ["group_user_id"]
            isOneToOne: false
            referencedRelation: "group_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tomatoe_target_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_group_creator: {
        Args: {
          p_user_id: string
          p_group_id: string
        }
        Returns: boolean
      }
      check_user_group_membership: {
        Args: {
          p_user_id: string
          p_group_id: string
        }
        Returns: boolean
      }
      get_group_user_profile: {
        Args: {
          "": unknown
        }
        Returns: {
          created_at: string
          id: string
          user_id: string
          username: string
        }[]
      }
      get_invite: {
        Args: {
          p_token: string
        }
        Returns: {
          created_at: string
          expires_at: string
          group_id: string
          id: string
          token: string
          used: boolean
        }[]
      }
      increment_tomatoes_received: {
        Args: {
          tomatoe_target_id: string
          amount: number
        }
        Returns: undefined
      }
      join_group: {
        Args: {
          p_user_id: string
          p_group_id: string
          p_token: string
        }
        Returns: undefined
      }
      throw_tomatoes: {
        Args: {
          throwing_user_id: string
          tomato_target_id: string
          amount_to_throw: number
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
