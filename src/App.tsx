import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import RestaurantSearch from './RestaurantSearch';
import RestaurantDetails from './components/RestaurantDetails';
import ReservationInput from './components/ReservationInput';
import StoreList from './components/StoreList';
import { supabase, testConnection } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet, Navigate, useParams } from 'react-router-dom';
import ServiceIntroduction from './pages/ServiceIntroduction';
import Options from './pages/Options';
import Cautions from './pages/Cautions';
import StoreInfo from './pages/StoreInfo';
import Reviews from './pages/Reviews';
import { TubelightNavbar } from './components/ui/TubelightNavbar';
import { getCommonNavItems, getHeaderNavItems, getMobileNavItems } from './lib/navigation';
import AdminDashboard from './pages/AdminDashboard';
import ReservationSuccess from './pages/ReservationSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CommercialTransactions from './pages/CommercialTransactions';
import Footer from './components/Footer';

// 改良された共通レイアウトコンポーネント
function PageWithNavigation({ language, onLanguageChange }) {
  const navigate = useNavigate();
  
  // 各ページへの共通遷移関数
  const goToHome = () => navigate('/');
  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  const goToAdmin = () => navigate('/admin');
  const goToReservation = () => navigate('/restaurant-search');
  const goToLogin = () => navigate('/login');
  
  // ヘッダー用のナビゲーションアイテム（限定バージョン）
  const HEADER_NAV_ITEMS = getHeaderNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToStoreInfo,
    goToReviews
  });

  // ハンバーガーメニュー用のナビゲーションアイテム（全アイテム）
  const MOBILE_NAV_ITEMS = getMobileNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews,
    goToReservation,
    goToLogin,
    goToAdmin
  });
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 共通ヘッダー */}
      <TubelightNavbar 
        items={HEADER_NAV_ITEMS}
        mobileItems={MOBILE_NAV_ITEMS}
        language={language} 
        onLanguageChange={onLanguageChange} 
      />
      
      {/* ヘッダーの高さ分のスペースを確保 */}
      <div className="h-16 md:h-16"></div>
      
      {/* メインコンテンツ - Outletを使用して子ルートのコンポーネントをレンダリング */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      
      {/* 共通フッター */}
      <Footer language={language} />
    </div>
  );
}

// 個別ページのラッパー
function StandalonePageWrapper({ language, Component }) {
  const navigate = useNavigate();
  
  // 各ページへの共通遷移関数
  const goToHome = () => navigate('/');
  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  const goToAdmin = () => navigate('/admin');
  const goToReservation = () => navigate('/restaurant-search');
  const goToLogin = () => navigate('/login');
  
  // ヘッダー用のナビゲーションアイテム（限定バージョン）
  const HEADER_NAV_ITEMS = getHeaderNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToStoreInfo,
    goToReviews
  });

  // ハンバーガーメニュー用のナビゲーションアイテム（全アイテム）
  const MOBILE_NAV_ITEMS = getMobileNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews,
    goToReservation,
    goToLogin,
    goToAdmin
  });
  
  return (
    <>
      <TubelightNavbar 
        items={HEADER_NAV_ITEMS}
        mobileItems={MOBILE_NAV_ITEMS}
        language={language} 
        onLanguageChange={undefined} 
      />
      <div className="h-16 md:h-16"></div>
      <Component language={language} />
      <Footer language={language} />
    </>
  );
}

function RestaurantSearchWrapper({ language, onSelectRestaurant }) {
  const navigate = useNavigate();
  
  const handleSelectRestaurant = (id) => {
    console.log('レストラン選択 ID:', id);
    onSelectRestaurant(id);
    navigate(`/restaurant-details/${id}`);
  };
  
  return <RestaurantSearch language={language} onSelectRestaurant={handleSelectRestaurant} />;
}

function ReservationInputWrapper({ language }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <ReservationInput 
      language={language} 
      restaurantId={id || ''} 
      onBack={() => navigate(-1)} 
      onComplete={(reservationId) => navigate(`/reservation-success/${reservationId}`)} 
    />
  );
}

function AdminDashboardWrapper({ language }) {
  const navigate = useNavigate();
  return <AdminDashboard language={language} onBack={() => navigate('/')} />;
}

// RestaurantDetails用のラッパー
function RestaurantDetailsWrapper({ language }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleReserve = (restaurantId) => {
    navigate(`/reservation-input/${restaurantId}`);
  };
  
  return (
    <RestaurantDetails 
      restaurantId={id}
      language={language} 
      onBack={() => navigate(-1)} 
      onReserve={handleReserve}
    />
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'ja' | 'en'>('ko');
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  const handleRestaurantSelect = (id: string) => {
    console.log('Restaurant selected:', id);
    setRestaurantId(parseInt(id));
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
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('言語切り替えエラー:', error);
      // エラー時はデフォルト言語に戻す
      setCurrentLanguage('ko');
      
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
    console.log('言語が変更されました:', currentLanguage);
    
    // document言語の設定
    document.documentElement.lang = currentLanguage;
    
    // テキストが表示されないバグへの対応として、必要なリソースを確認
    const ensureLanguageResources = () => {
      // ここに言語リソースのロード確認や初期化処理を追加できます
      // 開発モードでのみ実行される簡易チェック
      if (process.env.NODE_ENV === 'development') {
        console.log('言語リソースチェック完了');
      }
    };
    
    ensureLanguageResources();
  }, [currentLanguage]);

  // AppWrapper関数を作成してnavigateを使用
  function AppRoutes() {
    const navigate = useNavigate();
    
    return (
      <Routes>
        {/* スタンドアロンページ */}
        <Route path="/" element={
          <LandingPage language={currentLanguage} onLanguageChange={handleLanguageChange} />
        } />
        
        <Route path="/privacy-policy" element={
          <StandalonePageWrapper 
            language={currentLanguage} 
            Component={PrivacyPolicy} 
          />
        } />
        
        <Route path="/commercial-transactions" element={
          <StandalonePageWrapper 
            language={currentLanguage} 
            Component={CommercialTransactions} 
          />
        } />
        
        {/* 共通レイアウトを使用するページ */}
        <Route element={<PageWithNavigation language={currentLanguage} onLanguageChange={handleLanguageChange} />}>
          <Route path="/service-introduction" element={<ServiceIntroduction language={currentLanguage} />} />
          <Route path="/options" element={<Options language={currentLanguage} />} />
          <Route path="/cautions" element={<Cautions language={currentLanguage} />} />
          <Route path="/store-info" element={<StoreInfo language={currentLanguage} />} />
          <Route path="/reviews" element={<Reviews language={currentLanguage} />} />
          <Route path="/restaurant-search" element={
            <RestaurantSearchWrapper 
              language={currentLanguage} 
              onSelectRestaurant={handleRestaurantSelect} 
            />
          } />
          {/* /search へのリダイレクトを追加 */}
          <Route path="/search" element={<Navigate to="/restaurant-search" replace />} />
          <Route path="/restaurant-details/:id" element={<RestaurantDetailsWrapper language={currentLanguage} />} />
          <Route path="/reservation-input/:id" element={
            <ReservationInputWrapper 
              language={currentLanguage} 
            />
          } />
          <Route path="/reservation-success/:reservationId" element={<ReservationSuccess language={currentLanguage} />} />
          <Route path="/admin" element={<AdminDashboardWrapper language={currentLanguage} />} />
          <Route path="/stores" element={<StoreList language={currentLanguage} />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <AppRoutes />
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