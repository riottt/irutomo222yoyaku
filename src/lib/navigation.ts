import { Home, Info, CreditCard, Clock, MapPin, Calendar, Settings } from 'lucide-react';

// 共通ナビゲーションアイテムの定義
export const getCommonNavItems = (language: 'ko' | 'ja' | 'en', goToFunctions: {
  goToServiceIntroduction: () => void;
  goToOptions: () => void;
  goToCautions: () => void;
  goToStoreInfo: () => void;
  goToReviews: () => void;
  goToAdmin?: () => void; // 管理者ダッシュボードへの遷移関数（オプション）
}) => {
  const { goToServiceIntroduction, goToOptions, goToCautions, goToStoreInfo, goToReviews, goToAdmin } = goToFunctions;
  
  // 基本のナビゲーションアイテム
  const navItems = [
    {
      name: language === 'ko' ? '서비스 소개' : language === 'ja' ? 'サービス紹介' : 'Service Introduction',
      url: '/service-introduction',
      icon: Info,
      onClick: goToServiceIntroduction
    },
    {
      name: language === 'ko' ? '옵션' : language === 'ja' ? 'オプション' : 'Options',
      url: '/options',
      icon: CreditCard,
      onClick: goToOptions
    },
    {
      name: language === 'ko' ? '주의사항' : language === 'ja' ? '注意事項' : 'Cautions',
      url: '/cautions',
      icon: Clock,
      onClick: goToCautions
    },
    {
      name: language === 'ko' ? '점포 정보' : language === 'ja' ? '店舗情報' : 'Store Info',
      url: '/store-info',
      icon: MapPin,
      onClick: goToStoreInfo
    },
    {
      name: language === 'ko' ? '리뷰' : language === 'ja' ? 'レビュー' : 'Reviews',
      url: '/reviews',
      icon: Calendar,
      onClick: goToReviews
    }
  ];
  
  // 管理者ダッシュボードへのリンクを追加
  if (goToAdmin) {
    navItems.push({
      name: language === 'ko' ? '관리자 대시보드' : language === 'ja' ? '管理者ダッシュボード' : 'Admin Dashboard',
      url: '/admin',
      icon: Settings,
      onClick: goToAdmin
    });
  }
  
  return navItems;
}; 