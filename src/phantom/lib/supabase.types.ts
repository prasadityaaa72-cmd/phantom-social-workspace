export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string; avatar_url: string | null; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string; avatar_url?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; display_name?: string; avatar_url?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      user_settings: {
        Row: { user_id: string; theme: string; accent: string; compact_mode: boolean; updated_at: string };
        Insert: { user_id: string; theme?: string; accent?: string; compact_mode?: boolean; updated_at?: string };
        Update: { user_id?: string; theme?: string; accent?: string; compact_mode?: boolean; updated_at?: string };
        Relationships: [];
      };
      posts: {
        Row: { id: string; author_id: string; content: string; media_url: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; author_id: string; content?: string; media_url?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; author_id?: string; content?: string; media_url?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      post_likes: {
        Row: { post_id: string; user_id: string; created_at: string };
        Insert: { post_id: string; user_id: string; created_at?: string };
        Update: { post_id?: string; user_id?: string; created_at?: string };
        Relationships: [];
      };
      post_comments: {
        Row: { id: string; post_id: string; author_id: string; content: string; created_at: string };
        Insert: { id?: string; post_id: string; author_id: string; content: string; created_at?: string };
        Update: { id?: string; post_id?: string; author_id?: string; content?: string; created_at?: string };
        Relationships: [];
      };
      saved_posts: {
        Row: { post_id: string; user_id: string; created_at: string };
        Insert: { post_id: string; user_id: string; created_at?: string };
        Update: { post_id?: string; user_id?: string; created_at?: string };
        Relationships: [];
      };
      conversations: {
        Row: { id: string; created_by: string; title: string | null; created_at: string };
        Insert: { id?: string; created_by: string; title?: string | null; created_at?: string };
        Update: { id?: string; created_by?: string; title?: string | null; created_at?: string };
        Relationships: [];
      };
      conversation_members: {
        Row: { conversation_id: string; user_id: string; joined_at: string };
        Insert: { conversation_id: string; user_id: string; joined_at?: string };
        Update: { conversation_id?: string; user_id?: string; joined_at?: string };
        Relationships: [];
      };
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; content: string; created_at: string };
        Insert: { id?: string; conversation_id: string; sender_id: string; content: string; created_at?: string };
        Update: { id?: string; conversation_id?: string; sender_id?: string; content?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
