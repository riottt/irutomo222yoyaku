import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import RestaurantSearch from './RestaurantSearch';
import ReservationInput from './components/ReservationInput';
import RestaurantDetails from './components/RestaurantDetails';
import StoreList from './components/StoreList';
import StaffDashboard from './components/StaffDashboard';
import ReservationHistory from './components/ReservationHistory';
import { ToastProvider } from './components/ui/toast';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ui/theme-provider';
import { userPreferences } from './lib/storage';
import { AuthProvider } from './contexts/AuthContext';
import { syncUserPreferencesToSupabase, syncUserPreferencesFromSupabase } from './lib/user-preferences';
import { supabase } from './lib/supabaseClient';

type Page = 'landing' | 'search' | 'details' | 'reservation' | 'stores' | 'staff' | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [language, setLanguage] = useState<'ko' | 'ja'>(userPreferences.getLanguage());
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(userPreferences.getEmail());
  const [defaultTheme] = useState<'light' | 'dark' | 'system'>(userPreferences.getTheme());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // URLパラメータからページを設定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') as Page | null;
    
    if (page && ['landing', 'search', 'stores', 'staff', 'history'].includes(page)) {
      setCurrentPage(page);
    }
    
    const lang = params.get('lang') as 'ko' | 'ja' | null;
    if (lang && ['ko', 'ja'].includes(lang)) {
      setLanguage(lang);
    }

    const email = params.get('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Supabaseの認証状態を監視
  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        userPreferences.setEmail(session.user.email);
        
        // Supabaseからユーザー設定を取得して同期
        syncUserPreferencesFromSupabase(session.user.email);
      }
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (session?.user?.email) {
          setUserEmail(session.user.email);
          userPreferences.setEmail(session.user.email);
          
          // ログイン時にSupabaseからユーザー設定を取得
          if (event === 'SIGNED_IN') {
            syncUserPreferencesFromSupabase(session.user.email);
          }
        } else {
          setUserEmail(null);
          userPreferences.setEmail(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ユーザー設定の変更を保存
  useEffect(() => {
    userPreferences.setLanguage(language);
    
    // ログイン中の場合、Supabaseにも設定を同期
    if (userEmail && isAuthenticated) {
      syncUserPreferencesToSupabase(userEmail);
    }
  }, [language, isAuthenticated]);

  useEffect(() => {
    userPreferences.setEmail(userEmail);
  }, [userEmail]);

  // ページ変更時にURLを更新
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage);
    params.set('lang', language);
    
    if (userEmail) {
      params.set('email', userEmail);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, language, userEmail]);

  const handleReserveClick = () => {
    setCurrentPage('search');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'ko' ? 'ja' : 'ko');
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('details');
  };

  const handleReservationStart = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('reservation');
  };

  const handleStoreListClick = () => {
    setCurrentPage('stores');
  };

  const handleStaffDashboardClick = () => {
    setCurrentPage('staff');
  };

  const handleHistoryClick = () => {
    setCurrentPage('history');
  };

  return (
    <ThemeProvider defaultTheme={defaultTheme} storageKey="irutomosite-theme">
      <AuthProvider>
          <ErrorBoundary language={language}>
            <ToastProvider>
              <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
                <div id="main-content">
                  {currentPage === 'landing' ? (
                    <LandingPage
                      language={language}
                      onLanguageToggle={handleLanguageToggle}
                      onReserveClick={handleReserveClick}
                      onStoreListClick={handleStoreListClick}
                      onStaffDashboardClick={handleStaffDashboardClick}
                      onHistoryClick={handleHistoryClick}
                    />
                  ) : currentPage === 'search' ? (
                    <RestaurantSearch
                      language={language}
                      onBack={() => setCurrentPage('landing')}
                      onSelect={handleRestaurantSelect}
                      onLanguageToggle={handleLanguageToggle}
                    />
                  ) : currentPage === 'details' && selectedRestaurantId ? (
                    <RestaurantDetails
                      restaurantId={selectedRestaurantId}
                      language={language}
                      onBack={() => setCurrentPage('search')}
                      onReserve={handleReservationStart}
                    />
                  ) : currentPage === 'reservation' && selectedRestaurantId ? (
                    <ReservationInput
                      restaurantId={selectedRestaurantId}
                      language={language}
                      onBack={() => setCurrentPage('details')}
                    />
                  ) : currentPage === 'stores' ? (
                    <StoreList
                      language={language}
                      onBack={() => setCurrentPage('landing')}
                      onLanguageToggle={handleLanguageToggle}
                    />
                  ) : currentPage === 'staff' ? (
                    <StaffDashboard 
                      language={language}
                      onBack={() => setCurrentPage('landing')}
                      onLanguageToggle={handleLanguageToggle}
                    />
                  ) : currentPage === 'history' ? (
                    <ReservationHistory
                      language={language}
                      userEmail={userEmail || undefined}
                      onBack={() => setCurrentPage('landing')}
                      onLanguageToggle={handleLanguageToggle}
                    />
                  ) : null}
                </div>
              </div>
            </ToastProvider>
          </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;