import React, { useState, useEffect, useCallback, memo } from 'react';
import { PricePlan } from '../../types/pricePlan';

interface PricingInteractionProps {
  starterMonth: number;
  starterAnnual: number;
  proMonth: number;
  proAnnual: number;
  pricePlans?: PricePlan[];
  activePlan?: number;
  onPlanSelect?: (planIndex: number) => void;
  language?: 'ko' | 'ja' | 'en';
}

// メモ化されたプランカードコンポーネント
const PlanCard = memo(({ 
  plan, 
  index, 
  selectedPlan, 
  isDisabled, 
  language, 
  getCurrencySymbol, 
  formatAmount, 
  getConvertedAmount, 
  handlePlanSelect, 
  getPlanDescription 
}) => {
  return (
    <div
      key={index}
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 relative ${
        selectedPlan === index 
          ? 'border-[#FF8C00] transform scale-105 z-10 shadow-xl' 
          : isDisabled
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-gray-200 opacity-80 hover:opacity-100 hover:border-gray-300'
      }`}
      onClick={() => handlePlanSelect(index)}
    >
      <div className={`p-5 ${selectedPlan === index ? 'bg-orange-50' : ''}`}>
        <h3 className={`text-xl font-bold text-center ${selectedPlan === index ? 'text-[#FF8C00]' : 'text-gray-700'}`}>
          {language === 'ko' 
            ? plan.name === 'small' ? '스몰' : plan.name === 'medium' ? '미디엄' : '라지'
            : language === 'en' 
            ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1)
            : plan.name === 'small' ? '스몰' : plan.name === 'medium' ? '미디엄' : '라지'}
        </h3>
        <p className="text-gray-500 text-center text-sm mb-4">
          {`${plan.min_party_size}〜${plan.max_party_size}${
            language === 'ko' ? '명' : language === 'en' ? ' people' : '人'
          }`}
        </p>
        <div className="flex justify-center items-baseline my-8">
          {language === 'ko' ? (
            <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
              {getCurrencySymbol(language)}
              {formatAmount(getConvertedAmount(plan.amount, language), language)}
            </span>
          ) : language === 'en' ? (
            <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
              {getCurrencySymbol(language)}
              {formatAmount(getConvertedAmount(plan.amount, language), language)}
            </span>
          ) : (
            <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
              {getCurrencySymbol(language)}
              {formatAmount(plan.amount, language)}
            </span>
          )}
        </div>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="flex items-center">
            <svg className={`w-4 h-4 mr-2 ${selectedPlan === index ? 'text-[#FF8C00]' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {language === 'ko' && plan.description_ko 
              ? plan.description_ko 
              : language === 'en' && plan.description_en 
              ? plan.description_en 
              : plan.description_ja || getPlanDescription(index)}
          </li>
        </ul>
      </div>
      <div className={`p-4 ${selectedPlan === index ? 'bg-orange-50' : 'bg-gray-50'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlanSelect(index);
          }}
          disabled={isDisabled}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
              : selectedPlan === index 
              ? 'bg-[#FF8C00] hover:bg-[#E67E00] text-white focus:ring-[#FF8C00]'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-300'
          }`}
        >
          {isDisabled
            ? language === 'ko' ? '선택 불가' : language === 'en' ? 'Not available' : '選択不可'
            : selectedPlan === index
            ? language === 'ko' ? '선택됨' : language === 'en' ? 'Selected' : '選択中'
            : language === 'ko' ? '이 플랜 선택' : language === 'en' ? 'Select this plan' : 'このプランを選択'}
        </button>
      </div>
      {selectedPlan === index && (
        <div className="absolute -top-2 right-4 bg-[#FF8C00] text-white px-3 py-1 rounded-full text-xs font-bold transform translate-y-2">
          {language === 'ko' ? '선택됨' : language === 'en' ? 'Selected' : '選択中'}
        </div>
      )}
      {isDisabled && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium text-gray-600">
              {language === 'ko' 
                ? '현재 인원수에 맞지 않습니다' 
                : language === 'en' 
                ? 'Not suitable for current party size' 
                : '現在の人数に適していません'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export function PricingInteraction({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
  pricePlans = [],
  activePlan = 0,
  onPlanSelect,
  language = 'ja',
}: PricingInteractionProps) {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<number>(activePlan);
  const [partySize, setPartySize] = useState<number>(0);

  useEffect(() => {
    setSelectedPlan(activePlan);
    
    // 現在選択されているプランから人数を取得
    if (pricePlans.length > activePlan) {
      const plan = pricePlans[activePlan];
      // 人数の中間値を取得（例：1〜4人なら2.5人）
      const avgSize = Math.floor((plan.min_party_size + plan.max_party_size) / 2);
      setPartySize(avgSize);
    }
  }, [activePlan, pricePlans]);

  const handlePlanSelect = useCallback((index: number) => {
    // 選択できないプランの場合は何もしない
    if (isPlanDisabled(index)) return;
    
    setSelectedPlan(index);
    if (onPlanSelect) {
      onPlanSelect(index);
    }
  }, [onPlanSelect]);
  
  // プランが選択可能かどうかを判定
  const isPlanDisabled = useCallback((index: number): boolean => {
    if (pricePlans.length <= index) return false;
    
    const plan = pricePlans[index];
    const activePlanObj = pricePlans[activePlan];
    
    // アクティブなプランと同じプランは選択可能
    if (plan.name === activePlanObj?.name) return false;
    
    return true;
  }, [pricePlans, activePlan]);

  // 表示用テキストの取得
  const getToggleText = useCallback((isSmall: boolean) => {
    if (isSmall) {
      if (language === 'ko') return '일반 예약';
      if (language === 'en') return 'Standard Plan';
      return '通常予約';
    } else {
      if (language === 'ko') return '단체 예약';
      if (language === 'en') return 'Group Plan';
      return '団体予約';
    }
  }, [language]);

  const getPlanTitle = (index: number) => {
    if (pricePlans && pricePlans.length > index) {
      const plan = pricePlans[index];
      if (language === 'ko' && plan.name) {
        switch (plan.name) {
          case 'small': return '스몰';
          case 'medium': return '미디엄';
          case 'large': return '라지';
          default: return plan.name;
        }
      }
      if (language === 'en' && plan.name) return plan.name.charAt(0).toUpperCase() + plan.name.slice(1);
      
      // デフォルトは日本語
      switch (plan.name) {
        case 'small': return '스몰';
        case 'medium': return '미디엄';
        case 'large': return '라지';
        default: return plan.name;
      }
    }
    
    // フォールバック
    switch (index) {
      case 0: return language === 'ko' ? '스몰' : language === 'en' ? 'Small' : '스몰';
      case 1: return language === 'ko' ? '미디엄' : language === 'en' ? 'Medium' : '미디엄';
      case 2: return language === 'ko' ? '라지' : language === 'en' ? 'Large' : '라지';
      default: return '';
    }
  };

  const getPlanSize = (index: number) => {
    if (pricePlans && pricePlans.length > index) {
      const plan = pricePlans[index];
      return `${plan.min_party_size}〜${plan.max_party_size}${language === 'ko' ? '명' : language === 'en' ? ' people' : '人'}`;
    }
    
    // フォールバック
    switch (index) {
      case 0: return language === 'ko' ? '1〜4명' : language === 'en' ? '1〜4 people' : '1〜4人';
      case 1: return language === 'ko' ? '5〜8명' : language === 'en' ? '5〜8 people' : '5〜8人';
      case 2: return language === 'ko' ? '9〜12명' : language === 'en' ? '9〜12 people' : '9〜12人';
      default: return '';
    }
  };

  const getPlanAmount = (index: number) => {
    if (pricePlans && pricePlans.length > index) {
      return pricePlans[index].amount.toLocaleString();
    }
    
    // フォールバック
    switch (index) {
      case 0: return '1,000';
      case 1: return '2,000';
      case 2: return '3,000';
      default: return '0';
    }
  };
  
  const getPlanDescription = useCallback((index: number) => {
    if (language === 'ko') {
      return index === 0 ? '1~4명 개인 예약 플랜' : index === 1 ? '5~8명 단체 예약 플랜' : '9~12명 VIP 서포트 플랜';
    } else if (language === 'en') {
      return index === 0 ? 'Individual reservation for 1-4 people' : index === 1 ? 'Group reservation for 5-8 people' : 'VIP support for 9-12 people';
    } else {
      return index === 0 ? '1〜4人向け個人予約プラン' : index === 1 ? '5〜8人向け優先予約特典' : '9〜12人向けVIPサポート付き';
    }
  }, [language]);
  
  const getSelectButtonText = () => {
    if (language === 'ko') return '이 플랜 선택';
    if (language === 'en') return 'Select this plan';
    return 'このプランを選択';
  };

  const getPlanLabel = (plan: any): string => {
    if (!plan) return '';
    
    return language === 'ko' 
      ? `${plan.min_party_size}-${plan.max_party_size}명` 
      : language === 'en' 
      ? `${plan.min_party_size}-${plan.max_party_size} people` 
      : `${plan.min_party_size}-${plan.max_party_size}人`;
  };

  // 言語に基づいて金額を変換（最新の為替レートに基づく）
  const getConvertedAmount = useCallback((amount: number, language: 'ko' | 'ja' | 'en') => {
    // 円 -> ドル (150円 = 1ドル)
    if (language === 'en') return amount / 150;
    // 円 -> ウォン (1円 = 9.7ウォン)
    if (language === 'ko') return amount * 9.7;
    // デフォルトは円
    return amount;
  }, []);

  // 通貨記号を取得
  const getCurrencySymbol = useCallback((language: 'ko' | 'ja' | 'en') => {
    return language === 'ko' ? '₩' : language === 'en' ? '$' : '¥';
  }, []);

  // 通貨の表示名を取得
  const getCurrencyName = (): string => {
    return language === 'ko' ? 'ウォン' : language === 'en' ? 'USD' : '円';
  };

  // 数値をフォーマット
  const formatAmount = useCallback((value: number, language: 'ko' | 'ja' | 'en') => {
    const locale = language === 'ko' ? 'ko-KR' : language === 'en' ? 'en-US' : 'ja-JP';
    
    if (language === 'en') {
      // 英語の場合は小数点以下2桁まで表示
      return new Intl.NumberFormat(locale, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(value);
    }
    
    return new Intl.NumberFormat(locale).format(value);
  }, []);

  // 選択ボタン
  const SelectPlanButton = useCallback(({ onClick, text, language }: { onClick: () => void, text?: string, language: 'ko' | 'ja' | 'en' }) => {
    const buttonText = text || (
      language === 'ko' ? '이 플랜 선택' : 
      language === 'en' ? 'Select this plan' : 
      'このプランを選択'
    );
    
    return (
      <button
        onClick={onClick}
        className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:ring-opacity-50"
      >
        {buttonText}
      </button>
    );
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 料金プランカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 各プランを動的に生成 */}
        {pricePlans.length > 0 ? (
          // すべてのプランを表示
          pricePlans.map((plan, index) => {
            const isDisabled = isPlanDisabled(index);
            return (
              <PlanCard
                key={`${plan.id}-${index}`}
                plan={plan}
                index={index}
                selectedPlan={selectedPlan}
                isDisabled={isDisabled}
                language={language}
                getCurrencySymbol={getCurrencySymbol}
                formatAmount={formatAmount}
                getConvertedAmount={getConvertedAmount}
                handlePlanSelect={handlePlanSelect}
                getPlanDescription={getPlanDescription}
              />
            );
          })
        ) : (
          // フォールバック：プランがない場合は従来通り表示
          [0, 1, 2].map((index) => {
            const isDisabled = index !== activePlan;
            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 relative ${
                  selectedPlan === index 
                    ? 'border-[#FF8C00] transform scale-105 z-10 shadow-xl' 
                    : isDisabled
                    ? 'border-gray-200 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 opacity-80 hover:opacity-100 hover:border-gray-300'
                }`}
                onClick={() => handlePlanSelect(index)}
              >
                <div className={`p-5 ${selectedPlan === index ? 'bg-orange-50' : ''}`}>
                  <h3 className={`text-xl font-bold text-center ${selectedPlan === index ? 'text-[#FF8C00]' : 'text-gray-700'}`}>
                    {getPlanTitle(index)}
                  </h3>
                  <p className="text-gray-500 text-center text-sm mb-4">{getPlanSize(index)}</p>
                  <div className="flex justify-center items-baseline my-8">
                    {language === 'ko' ? (
                      <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
                        {getCurrencySymbol(language)}{formatAmount(getConvertedAmount(parseInt(getPlanAmount(index)), language), language)}
                      </span>
                    ) : language === 'en' ? (
                      <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
                        {getCurrencySymbol(language)}{formatAmount(getConvertedAmount(parseInt(getPlanAmount(index)), language), language)}
                      </span>
                    ) : (
                      <span className={`text-5xl font-extrabold ${selectedPlan === index ? 'text-[#FF8C00]' : ''}`}>
                        {getCurrencySymbol(language)}{getPlanAmount(index)}
                      </span>
                    )}
                  </div>
                  <ul className="text-sm text-gray-600 space-y-3">
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${selectedPlan === index ? 'text-[#FF8C00]' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {getPlanDescription(index)}
                    </li>
                  </ul>
                </div>
                <div className={`p-4 ${selectedPlan === index ? 'bg-orange-50' : 'bg-gray-50'}`}>
                  <button
                    onClick={() => handlePlanSelect(index)}
                    disabled={isDisabled}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                        : selectedPlan === index 
                        ? 'bg-[#FF8C00] hover:bg-[#E67E00] text-white focus:ring-[#FF8C00]'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-300'
                    }`}
                  >
                    {isDisabled
                      ? language === 'ko' ? '선택 불가' : language === 'en' ? 'Not available' : '選択不可'
                      : selectedPlan === index
                      ? language === 'ko' ? '선택됨' : language === 'en' ? 'Selected' : '選択中'
                      : language === 'ko' ? '이 플랜 선택' : language === 'en' ? 'Select this plan' : 'このプランを選択'}
                  </button>
                </div>
                {selectedPlan === index && (
                  <div className="absolute -top-2 right-4 bg-[#FF8C00] text-white px-3 py-1 rounded-full text-xs font-bold transform translate-y-2">
                    {language === 'ko' ? '선택됨' : language === 'en' ? 'Selected' : '選択中'}
                  </div>
                )}
                {isDisabled && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
                      <p className="text-sm font-medium text-gray-600">
                        {language === 'ko' 
                          ? '현재 인원수에 맞지 않습니다' 
                          : language === 'en' 
                          ? 'Not suitable for current party size' 
                          : '現在の人数に適していません'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}