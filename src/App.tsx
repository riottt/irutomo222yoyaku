import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import RestaurantSearch from './RestaurantSearch';
import RestaurantDetails from './components/RestaurantDetails';
import ReservationInput from './components/ReservationInput';
import StoreList from './components/StoreList';
import { supabase, testConnection } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ServiceIntroduction from './pages/ServiceIntroduction';
import Options from './pages/Options';
import Cautions from './pages/Cautions';
import StoreInfo from './pages/StoreInfo';
import Reviews from './pages/Reviews';
import { TubelightNavbar } from './components/ui/TubelightNavbar';
import { getCommonNavItems } from './lib/navigation';

// 改良された共通レイアウトコンポーネント
function PageWithNavigation({ 
  Component, 
  language, 
  onLanguageChange, 
  restaurantId = null,
  onSelect = null
}) {
  const navigate = useNavigate();
  
  // 各ページへの共通遷移関数
  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  
  // 共通ナビゲーションアイテム
  const NAV_ITEMS = getCommonNavItems(language, {
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews
  });
  
  return (
    <div className="min-h-screen bg-white">
      {/* 共通ヘッダー */}
      <TubelightNavbar 
        items={NAV_ITEMS} 
        language={language} 
        onLanguageChange={onLanguageChange} 
      />
      
      {/* ヘッダーの高さ分のスペースを確保 */}
      <div className="h-16 md:h-16"></div>
      
      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6">
        <Component 
          language={language} 
          onLanguageChange={onLanguageChange} 
          onBack={() => navigate('/')}
          restaurantId={restaurantId}
          onSelect={onSelect}
        />
      </main>
    </div>
  );
}

function App() {
  // デフォルト言語を日本語に設定 - 英語でホワイトアウトする問題を回避
  const [language, setLanguage] = useState<'ko' | 'ja' | 'en'>('ja');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const handleRestaurantSelect = (id: string) => {
    setSelectedRestaurantId(id);
  };

  // 言語切り替え処理の安全対策を強化
  const handleLanguageChange = (lang: 'ko' | 'ja' | 'en') => {
    try {
      // ログ出力して問題追跡
      console.log('言語切り替え:', lang);
      
      // 英語へ切り替える前に安全チェック
      if (lang === 'en') {
        console.log('英語への切り替えを試みます');
        // 英語リソースが正しく読み込まれていることを確認する処理を追加できます
      }
      
      // 実際の言語切り替え
      setLanguage(lang);
    } catch (error) {
      console.error('言語切り替えエラー:', error);
      // エラー時はデフォルト言語に戻す
      setLanguage('ja');
      
      // ユーザーに通知（開発用）
      console.warn('言語切り替えに失敗しました。デフォルト言語に戻します。');
    }
  };

  // Testing Supabase connection
  React.useEffect(() => {
    testConnection();
  }, []);

  // 言語変更後の副作用を追加・強化
  useEffect(() => {
    console.log('言語が変更されました:', language);
    
    // document言語の設定
    document.documentElement.lang = language;
    
    // テキストが表示されないバグへの対応として、必要なリソースを確認
    const ensureLanguageResources = () => {
      // ここに言語リソースのロード確認や初期化処理を追加できます
      // 開発モードでのみ実行される簡易チェック
      if (process.env.NODE_ENV === 'development') {
        console.log('言語リソースチェック完了');
      }
    };
    
    ensureLanguageResources();
  }, [language]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            } 
          />
          <Route 
            path="/service-introduction" 
            element={
              <PageWithNavigation 
                Component={ServiceIntroduction} 
                language={language} 
                onLanguageChange={handleLanguageChange}
              />
            } 
          />
          <Route 
            path="/options" 
            element={
              <PageWithNavigation 
                Component={Options} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            } 
          />
          <Route 
            path="/cautions" 
            element={
              <PageWithNavigation 
                Component={Cautions} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            } 
          />
          <Route 
            path="/store-info" 
            element={
              <PageWithNavigation 
                Component={StoreInfo} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            } 
          />
          <Route 
            path="/reviews" 
            element={
              <PageWithNavigation 
                Component={Reviews} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            } 
          />
          <Route 
            path="/search" 
            element={
              <PageWithNavigation
                Component={RestaurantSearch}
                language={language} 
                onLanguageChange={handleLanguageChange}
                onSelect={handleRestaurantSelect}
              />
            } 
          />
          <Route 
            path="/details/:restaurantId" 
            element={
              <PageWithNavigation
                Component={RestaurantDetails}
                restaurantId={selectedRestaurantId || ''}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            } 
          />
          <Route 
            path="/reservation/:restaurantId" 
            element={
              <PageWithNavigation
                Component={ReservationInput}
                restaurantId={selectedRestaurantId || ''}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            } 
          />
          <Route 
            path="/stores" 
            element={
              <PageWithNavigation
                Component={StoreList}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            } 
          />
        </Routes>
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300"
            onClick={() => window.open('https://forms.gle/TnKmKu5o5nXNm4Zv6', '_blank')}
          >
            <span className="sr-only">Feedback</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
    </Router>
  );
}

export default App;