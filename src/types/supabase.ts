export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Restaurant = {
  id: string;
  name: string;
  japanese_name: string | null;
  address: string;
  description: string | null;
  location: string;
  cuisine: string | null;
  rating: number | null;
  image_url: string | null;
  url: string | null;
  operating_hours: string | null;
  google_maps_link: string | null;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  user_id: string;
  restaurant_id: string;
  reservation_date: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'canceled';
  payment_status: 'pending' | 'completed';
  payment_amount: number;
  created_at: string;
  updated_at: string;
};

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
          name: string | null
          language_preference: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          language_preference?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          language_preference?: string | null
        }
      }
      restaurants: {
        Row: {
          id: string
          created_at: string
          name: string
          korean_name: string | null
          japanese_name: string | null
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
          has_vegetarian_options: boolean | null
          has_english_menu: boolean | null
          has_korean_menu: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          korean_name?: string | null
          japanese_name?: string | null
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
          has_vegetarian_options?: boolean | null
          has_english_menu?: boolean | null
          has_korean_menu?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          korean_name?: string | null
          japanese_name?: string | null
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
          has_vegetarian_options?: boolean | null
          has_english_menu?: boolean | null
          has_korean_menu?: boolean | null
        }
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
          payment_amount: number | null
          transaction_id: string | null
          cancellation_reason: string | null
          notes: string | null
          is_reviewed: boolean | null
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
          payment_amount?: number | null
          transaction_id?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          is_reviewed?: boolean | null
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
          payment_amount?: number | null
          transaction_id?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          is_reviewed?: boolean | null
        }
      }
    }
  }
}