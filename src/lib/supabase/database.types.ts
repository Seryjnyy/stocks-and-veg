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
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "group_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          times_tomatoed: number
          tomatoes: number
          tomatoes_received: number
          tomatoes_thrown: number
          user_id: string
          xp: number | null
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
          times_tomatoed?: number
          tomatoes?: number
          tomatoes_received?: number
          tomatoes_thrown?: number
          user_id: string
          xp?: number | null
        }
        Update: {
          created_at?: string
          day_full_completes?: number
          day_partial_completes?: number
          group_id?: string
          id?: string
          tasks_completed?: number
          tasks_not_completed?: number
          times_tomatoed?: number
          tomatoes?: number
          tomatoes_received?: number
          tomatoes_thrown?: number
          user_id?: string
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_user_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task: {
        Row: {
          created_at: string
          desc: string
          group_id: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          desc: string
          group_id: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          desc?: string
          group_id?: string
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
            foreignKeyName: "task_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          {
            foreignKeyName: "task_completion_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
