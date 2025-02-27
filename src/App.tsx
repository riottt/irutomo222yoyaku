import React, { useState } from 'react';
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

// Wrapper component to provide navigate function to pages
function PageWithNavigation({ 
  Component, 
  language, 
  onLanguageChange, 
  restaurantId = null,
  onSelect = null
}) {
  const navigate = useNavigate();
  
  return (
    <Component 
      language={language} 
      onLanguageChange={onLanguageChange} 
      onBack={() => navigate('/')}
      restaurantId={restaurantId}
      onSelect={onSelect}
    />
  );
}

function App() {
  const [language, setLanguage] = useState<'ko' | 'ja' | 'en'>('ko');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const handleRestaurantSelect = (id: string) => {
    setSelectedRestaurantId(id);
  };

  const handleLanguageChange = (lang: 'ko' | 'ja' | 'en') => {
    setLanguage(lang);
  };

  // Testing Supabase connection
  React.useEffect(() => {
    testConnection();
  }, []);

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