import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 接続テスト用の関数
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('restaurants').select('count()', { count: 'exact' });
    if (error) {
      console.error('Connection test error:', error);
      return { success: false, error: error.message };
    }
    console.log('Connection successful! Database has data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Connection test exception:', error);
    return { success: false, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false });

  if (error) throw error;
  return data;
};

export const createReservation = async (
  userId: string,
  restaurantId: string,
  reservationDate: Date,
  partySize: number
) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([
      {
        user_id: userId,
        restaurant_id: restaurantId,
        reservation_date: reservationDate.toISOString(),
        party_size: partySize,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};