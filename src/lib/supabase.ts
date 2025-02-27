import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.warn('VITE_SUPABASE_URL is', supabaseUrl ? 'set' : 'NOT SET');
  console.warn('VITE_SUPABASE_ANON_KEY is', supabaseAnonKey ? 'set' : 'NOT SET');
  // 開発環境用のフォールバック値を設定
  // 注意: 本番環境では必ず環境変数を設定すること
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://pyoyziehtekhpergqztm.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5b3l6aWVodGVraHBlcmdxenRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjU2MjgsImV4cCI6MjA1NjI0MTYyOH0.8X_4oNt3raXl2sK2MV6VWcLoWwyYHu0DguoPbiC2W-0'
);

// 接続テスト用の関数
export const testConnection = async () => {
  try {
    console.log('接続テスト開始...');
    console.log('使用中のSupabase URL:', supabaseUrl || '環境変数が設定されていません');
    
    // 単純なクエリに変更（count()は特定のデータベース設定が必要な場合がある）
    const { data, error } = await supabase.from('restaurants').select('id').limit(1);
    
    if (error) {
      console.error('Connection test error:', error);
      // 開発環境では詳細なエラー情報を表示
      if (process.env.NODE_ENV === 'development') {
        console.log('Supabase URL:', supabaseUrl);
        console.log('Error details:', JSON.stringify(error));
      }
      return { success: false, error: error.message };
    }
    
    console.log('接続成功! レストランデータの取得:', data);
    
    // 追加テスト: レストラン全件数を取得
    try {
      const { count, error: countError } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.warn('レストラン数取得エラー:', countError);
      } else {
        console.log(`データベース内のレストラン数: ${count}件`);
      }
    } catch (e) {
      console.warn('レストラン数取得中に例外が発生:', e);
    }
    
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
    
    if (error) {
      console.error('Sign in error:', error.message);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Sign in exception:', error);
    return { data: null, error: { message: 'An unexpected error occurred during sign in' } };
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
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Get restaurants error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Get restaurants exception:', error);
    return [];
  }
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