// Supabaseの型定義を生成するためのスクリプト
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Supabaseの型定義を生成します...');

try {
  // プロジェクトのルートディレクトリ
  const projectRoot = path.join(__dirname, '..');
  
  // src/typesディレクトリが存在するか確認
  const typesDir = path.join(projectRoot, 'src', 'types');
  if (!fs.existsSync(typesDir)) {
    console.log('src/typesディレクトリを作成します...');
    fs.mkdirSync(typesDir, { recursive: true });
  }
  
  // 型定義ファイルのパス
  const typesFilePath = path.join(typesDir, 'supabase.ts');
  
  // 型定義ファイルの内容
  const typesContent = `// Supabaseの型定義
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          language_preference: string
          role: string
          timezone: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          language_preference?: string
          role?: string
          timezone?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          language_preference?: string
          role?: string
          timezone?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          created_at: string
          name: string
          japanese_name: string | null
          korean_name: string | null
          address: string
          korean_address: string | null
          description: string | null
          korean_description: string | null
          cuisine: string | null
          rating: number | null
          image: string | null
          price_range: string | null
          location: string
          phone_number: string | null
          opening_hours: Json | null
          google_maps_link: string | null
          has_vegetarian_options: boolean
          has_english_menu: boolean
          has_korean_menu: boolean
          has_japanese_menu: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          japanese_name?: string | null
          korean_name?: string | null
          address: string
          korean_address?: string | null
          description?: string | null
          korean_description?: string | null
          cuisine?: string | null
          rating?: number | null
          image?: string | null
          price_range?: string | null
          location: string
          phone_number?: string | null
          opening_hours?: Json | null
          google_maps_link?: string | null
          has_vegetarian_options?: boolean
          has_english_menu?: boolean
          has_korean_menu?: boolean
          has_japanese_menu?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          japanese_name?: string | null
          korean_name?: string | null
          address?: string
          korean_address?: string | null
          description?: string | null
          korean_description?: string | null
          cuisine?: string | null
          rating?: number | null
          image?: string | null
          price_range?: string | null
          location?: string
          phone_number?: string | null
          opening_hours?: Json | null
          google_maps_link?: string | null
          has_vegetarian_options?: boolean
          has_english_menu?: boolean
          has_korean_menu?: boolean
          has_japanese_menu?: boolean
        }
        Relationships: []
      }
      reservations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          restaurant_id: string
          reservation_date: string
          reservation_time: string
          party_size: number
          name: string
          email: string
          phone: string
          special_requests: string | null
          status: string
          payment_status: string
          payment_amount: number
          transaction_id: string | null
          cancellation_reason: string | null
          notes: string | null
          is_reviewed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          restaurant_id: string
          reservation_date: string
          reservation_time: string
          party_size: number
          name: string
          email: string
          phone: string
          special_requests?: string | null
          status?: string
          payment_status?: string
          payment_amount?: number
          transaction_id?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          is_reviewed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          restaurant_id?: string
          reservation_date?: string
          reservation_time?: string
          party_size?: number
          name?: string
          email?: string
          phone?: string
          special_requests?: string | null
          status?: string
          payment_status?: string
          payment_amount?: number
          transaction_id?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          is_reviewed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          created_at: string
          reservation_id: string
          amount: number
          status: string
          payment_method: string
          transaction_id: string
          error_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          reservation_id: string
          amount: number
          status: string
          payment_method?: string
          transaction_id: string
          error_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          reservation_id?: string
          amount?: number
          status?: string
          payment_method?: string
          transaction_id?: string
          error_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          user_id: string
          restaurant_id: string
          rating: string
          comment: string | null
          photo_url: string | null
          is_verified: boolean
          helpful_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          restaurant_id: string
          rating: string
          comment?: string | null
          photo_url?: string | null
          is_verified?: boolean
          helpful_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          restaurant_id?: string
          rating?: string
          comment?: string | null
          photo_url?: string | null
          is_verified?: boolean
          helpful_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          timestamp: string
          details: Json
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          timestamp?: string
          details: Json
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          timestamp?: string
          details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      translations: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          language: string
          field_name: string
          value: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          language: string
          field_name: string
          value: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          language?: string
          field_name?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "staff" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
`;
  
  // 型定義ファイルを書き込む
  fs.writeFileSync(typesFilePath, typesContent);
  console.log(`型定義ファイルを生成しました: ${typesFilePath}`);
  
  console.log('Supabaseの型定義の生成が完了しました。');
} catch (error) {
  console.error('型定義の生成中にエラーが発生しました:', error.message);
  process.exit(1);
} 