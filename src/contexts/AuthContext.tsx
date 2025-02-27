import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  checkIsAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 管理者権限を確認する関数
  const checkIsAdmin = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // メールドメインでの管理者チェック - @irutomo.comは自動的に管理者
      if (user.email && user.email.endsWith('@irutomo.com')) {
        console.log('管理者権限が確認されました (メールドメイン):', user.email);
        setIsAdmin(true);
        return true;
      }
      
      // profilesテーブルで管理者権限を確認
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('プロフィール取得エラー:', error);
        return false;
      }
      
      const isUserAdmin = data && data.role === 'admin';
      console.log('管理者権限の確認結果:', isUserAdmin, data);
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error('管理者権限確認エラー:', error);
      return false;
    }
  };

  // セッションとユーザー情報の初期化
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkIsAdmin();
        }
      } catch (error) {
        console.error('セッション初期化エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkIsAdmin();
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // サインイン
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error && data.user) {
        setUser(data.user);
        setSession(data.session);
        await checkIsAdmin();
      }
      
      return { error };
    } catch (error) {
      console.error('サインインエラー:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // サインアップ
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    } catch (error) {
      console.error('サインアップエラー:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // サインアウト
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  // パスワードリセット
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('パスワードリセットエラー:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkIsAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
