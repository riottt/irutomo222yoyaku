import React, { useState } from 'react';
import LandingPage from './LandingPage';
import RestaurantSearch from './RestaurantSearch';
import ReservationInput from './components/ReservationInput';
import RestaurantDetails from './components/RestaurantDetails';
import StoreList from './components/StoreList';

type Page = 'landing' | 'search' | 'details' | 'reservation' | 'stores';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [language, setLanguage] = useState<'ko' | 'ja'>('ko');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'landing' ? (
        <LandingPage
          language={language}
          onLanguageToggle={handleLanguageToggle}
          onReserveClick={handleReserveClick}
          onStoreListClick={handleStoreListClick}
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
      ) : null}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            // @ts-ignore
            window.toggleCanvasEffect?.();
          }}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full"
        >
          エフェクト ON/OFF
        </button>
      </div>
    </div>
  );
}

export default App;