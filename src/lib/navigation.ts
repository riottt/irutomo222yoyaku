import { Home, Info, CreditCard, Clock, MapPin, Calendar, Settings } from 'lucide-react';

// ナビゲーションアイテムの型定義
interface NavItem {
  name: string;
  url: string;
  icon: any;
  onClick?: () => void;
  isMainNav?: boolean;
  isAdmin?: boolean;
}

// 共通ナビゲーションアイテムの定義
export const getCommonNavItems = (language: 'ko' | 'ja' | 'en', goToFunctions: {
  goToServiceIntroduction: () => void;
  goToOptions: () => void;
  goToCautions: () => void;
  goToStoreInfo: () => void;
  goToReviews: () => void;
  goToAdmin?: () => void; // 管理者ダッシュボードへの遷移関数（オプション）
}): NavItem[] => {
  const { goToServiceIntroduction, goToOptions, goToCautions, goToStoreInfo, goToReviews, goToAdmin } = goToFunctions;
  
  // 基本のナビゲーションアイテム
  const navItems = [
    {
      name: language === 'ko' ? '홈' : language === 'ja' ? 'ホーム' : 'Home',
      url: '/',
      icon: Home,
      onClick: undefined
    },
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

// ヘッダー用のナビゲーションアイテム（限定バージョン）
export const getHeaderNavItems = (language: 'ko' | 'ja' | 'en', goToFunctions: {
  goToHome: () => void;
  goToServiceIntroduction: () => void;
  goToStoreInfo: () => void;
  goToReviews: () => void;
}): NavItem[] => {
  const { goToHome, goToServiceIntroduction, goToStoreInfo, goToReviews } = goToFunctions;
  
  return [
    {
      name: language === 'ko' ? '홈' : language === 'ja' ? 'ホーム' : 'Home',
      url: '/',
      icon: Home,
      onClick: goToHome
    },
    {
      name: language === 'ko' ? '서비스 소개' : language === 'ja' ? 'サービス紹介' : 'Service Introduction',
      url: '/service-introduction',
      icon: Info,
      onClick: goToServiceIntroduction
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
};

// モバイルメニュー用のナビゲーションアイテム（全アイテム）
export const getMobileNavItems = (language: 'ko' | 'ja' | 'en', goToFunctions: {
  goToHome: () => void;
  goToServiceIntroduction: () => void;
  goToOptions: () => void;
  goToCautions: () => void;
  goToStoreInfo: () => void;
  goToReviews: () => void;
  goToAdmin?: () => void;
  goToReservation?: () => void;
}): NavItem[] => {
  const { 
    goToHome, 
    goToServiceIntroduction, 
    goToOptions, 
    goToCautions, 
    goToStoreInfo, 
    goToReviews, 
    goToAdmin,
    goToReservation
  } = goToFunctions;
  
  const navItems = [
    {
      name: language === 'ko' ? '홈' : language === 'ja' ? 'ホーム' : 'Home',
      url: '/',
      icon: Home,
      onClick: goToHome,
      isMainNav: true
    },
    {
      name: language === 'ko' ? '서비스 소개' : language === 'ja' ? 'サービス紹介' : 'Service Introduction',
      url: '/service-introduction',
      icon: Info,
      onClick: goToServiceIntroduction,
      isMainNav: true
    },
    {
      name: language === 'ko' ? '점포 정보' : language === 'ja' ? '店舗情報' : 'Store Info',
      url: '/store-info',
      icon: MapPin,
      onClick: goToStoreInfo,
      isMainNav: true
    },
    {
      name: language === 'ko' ? '리뷰' : language === 'ja' ? 'レビュー' : 'Reviews',
      url: '/reviews',
      icon: Calendar,
      onClick: goToReviews,
      isMainNav: true
    }
  ];
  
  // 予約ページへのリンク
  if (goToReservation) {
    navItems.push({
      name: language === 'ko' ? '예약하기' : language === 'ja' ? '予約へ進む' : 'Make Reservation',
      url: '/reservation',
      icon: Calendar,
      onClick: goToReservation,
      isMainNav: true
    });
  }
  
  // 管理者ダッシュボードへのリンク（管理メニュー配下に唯一残すアイテム）
  if (goToAdmin) {
    navItems.push({
      name: language === 'ko' ? '관리자 대시보드' : language === 'ja' ? '管理者ダッシュボード' : 'Admin Dashboard',
      url: '/admin',
      icon: Settings,
      onClick: goToAdmin,
      isMainNav: false,
      isAdmin: true
    });
  }
  
  return navItems;
}; 