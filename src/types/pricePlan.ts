export interface PricePlan {
  id: string;
  name: string; // 'small', 'medium', 'large'
  min_party_size: number;
  max_party_size: number;
  amount: number;
  currency: string;
  description_ja?: string;
  description_ko?: string;
  description_en?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PricePlanResponse {
  id: string;
  name: string;
  min_party_size: number;
  max_party_size: number;
  amount: number;
  currency: string;
  description_ja: string | null;
  description_ko: string | null;
  description_en: string | null;
}

export function getPricePlanDescription(plan: PricePlan, language: 'ja' | 'ko' | 'en'): string {
  if (language === 'ko' && plan.description_ko) {
    return plan.description_ko;
  } else if (language === 'en' && plan.description_en) {
    return plan.description_en;
  } else if (plan.description_ja) {
    return plan.description_ja;
  }
  
  // フォールバック
  switch (plan.name) {
    case 'small':
      return language === 'ko' ? '기본 예약 서비스' : 
             language === 'en' ? 'Basic reservation service' : 
             '基本予約サービス';
    case 'medium':
      return language === 'ko' ? '그룹 예약 서비스' : 
             language === 'en' ? 'Group reservation service' : 
             'グループ予約サービス';
    case 'large':
      return language === 'ko' ? '대규모 그룹 전용 서비스' : 
             language === 'en' ? 'Large group exclusive service' : 
             '大人数専用サービス';
    default:
      return '';
  }
}

export function calculatePriceByPartySize(partySize: number): number {
  if (partySize >= 1 && partySize <= 4) {
    return 1000;
  } else if (partySize >= 5 && partySize <= 8) {
    return 2000;
  } else if (partySize >= 9 && partySize <= 12) {
    return 3000;
  } else {
    return 1000; // デフォルト値
  }
} 