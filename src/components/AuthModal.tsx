import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'ko' | 'ja';
}

export default function AuthModal({ isOpen, onClose, onSuccess, language }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!email || !password) {
      setError(language === 'ko' 
        ? '이메일과 비밀번호를 모두 입력해주세요' 
        : 'メールアドレスとパスワードを入力してください');
      return false;
    }

    if (password.length < 6) {
      setError(language === 'ko'
        ? '비밀번호는 6자 이상이어야 합니다'
        : 'パスワードは6文字以上である必要があります');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(language === 'ko'
        ? '유효한 이메일 주소를 입력해주세요'
        : '有効なメールアドレスを入力してください');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await signUpWithEmail(email, password);
        
        if (signUpError) {
          if (signUpError.message?.includes('User already registered')) {
            setError(language === 'ko'
              ? '이미 등록된 이메일입니다. 로그인해주세요.'
              : '既に登録されているメールアドレスです。ログインしてください。');
            setIsSignUp(false);
          } else {
            throw signUpError;
          }
        } else if (signUpData) {
          onSuccess();
          resetForm();
          onClose();
        }
      } else {
        const { data: signInData, error: signInError } = await signInWithEmail(email, password);
        
        if (signInError) {
          if (signInError.message?.includes('Invalid login credentials')) {
            setError(language === 'ko'
              ? '이메일 또는 비밀번호가 올바르지 않습니다'
              : 'メールアドレスまたはパスワードが正しくありません');
          } else {
            throw signInError;
          }
        } else if (signInData.session) {
          onSuccess();
          resetForm();
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(language === 'ko' 
        ? '인증 중 오류가 발생했습니다. 다시 시도해주세요.' 
        : '認証エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(language === 'ko' 
        ? 'Google 로그인 중 오류가 발생했습니다.' 
        : 'Googleログインエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {language === 'ko' 
              ? (isSignUp ? '회원가입' : '로그인')
              : (isSignUp ? '会員登録' : 'ログイン')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'ko' ? '이메일' : 'メールアドレス'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring focus:ring-[#FF8C00] focus:ring-opacity-50"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'ko' ? '비밀번호' : 'パスワード'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring focus:ring-[#FF8C00] focus:ring-opacity-50"
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            <p className="mt-1 text-sm text-gray-500">
              {language === 'ko' 
                ? '6자 이상 입력해주세요'
                : '6文字以上入力してください'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] text-white py-2 px-4 rounded-md hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'ko' ? '처리중...' : '処理中...'}
              </span>
            ) : (
              language === 'ko' 
                ? (isSignUp ? '가입하기' : '로그인')
                : (isSignUp ? '登録する' : 'ログイン')
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {language === 'ko' ? '또는' : 'または'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {language === 'ko' ? 'Google로 계속하기' : 'Googleで続ける'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#FF8C00] hover:text-orange-600 text-sm"
            >
              {language === 'ko'
                ? (isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?')
                : (isSignUp ? 'すでにアカウントをお持ちですか？' : 'アカウントをお持ちでないですか？')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}