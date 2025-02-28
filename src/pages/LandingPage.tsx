import { useLanguage } from '../contexts/LanguageContext';

function LandingPage() {
  const { language, setLanguage } = useLanguage();
  
  const getLocalizedContent = () => {
    switch(language) {
      case 'en':
        return {
          title: "Find and Book Japanese Restaurants in Osaka",
          subtitle: "Enjoy authentic Japanese cuisine with our easy reservation service",
        };
      case 'ko':
        return {
          title: "오사카에서 일본 레스토랑 찾기 및 예약",
          subtitle: "쉬운 예약 서비스로 정통 일본 요리를 즐기세요",
        };
      default:
        return {
          title: "大阪の日本食レストランを検索・予約",
          subtitle: "簡単予約サービスで本格的な日本料理を楽しもう",
        };
    }
  };
  
  const content = getLocalizedContent();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">{content.title}</h1>
        <p className="text-xl text-center mb-8">{content.subtitle}</p>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage; 