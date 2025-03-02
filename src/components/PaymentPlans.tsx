import React, { useState, useEffect } from 'react';
import { PricingInteraction } from './ui/pricing-interaction';
import { PricePlan, getPricePlanDescription } from '../types/pricePlan';
import { getAllPricePlans, getPricePlanByPartySize, calculatePriceByPartySizeOffline } from '../lib/pricePlanService';

interface PaymentPlansProps {
  partySize: string;
  language: 'ko' | 'ja' | 'en';
  onPlanSelect: (amount: number, planName?: string) => void;
}

export default function PaymentPlans({ partySize, language, onPlanSelect }: PaymentPlansProps) {
  const [loading, setLoading] = useState(true);
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PricePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const size = parseInt(partySize, 10) || 1;
  
  // 初回読み込み時にすべての料金プランを取得
  useEffect(() => {
    const fetchPricePlans = async () => {
      try {
        setLoading(true);
        const plans = await getAllPricePlans();
        setPricePlans(plans);
      } catch (err) {
        console.error('料金プランの取得に失敗しました:', err);
        setError('料金プランの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPricePlans();
  }, []);
  
  // 人数が変更されたときおよびプランリストが更新されたときにフィルタリングとプラン選択を行う
  useEffect(() => {
    const filterAndSelectPlan = async () => {
      if (pricePlans.length === 0) return;
      
      try {
        // 現在の人数に適したプランを選択
        const matchingPlan = pricePlans.find(plan => 
          size >= plan.min_party_size && size <= plan.max_party_size
        );
        
        // すべてのプランを表示しつつ、適切なプランを選択
        setFilteredPlans(pricePlans);
        
        if (matchingPlan) {
          setSelectedPlan(matchingPlan);
          onPlanSelect(matchingPlan.amount, matchingPlan.name);
          console.log(`人数に基づいたプラン選択: ${matchingPlan.name}, 金額: ${matchingPlan.amount}`);
        } else {
          // 適合するプランがない場合はフォールバック
          const fallbackAmount = calculatePriceByPartySizeOffline(size);
          onPlanSelect(fallbackAmount);
          console.log(`フォールバックプラン金額: ${fallbackAmount}`);
        }
      } catch (err) {
        console.error('プランフィルタリング中にエラーが発生しました:', err);
        const fallbackAmount = calculatePriceByPartySizeOffline(size);
        onPlanSelect(fallbackAmount);
      }
    };
    
    filterAndSelectPlan();
  }, [size, pricePlans, onPlanSelect]);
  
  // プラン選択時の処理
  const handleSelectPlan = (planIndex: number) => {
    if (filteredPlans.length > planIndex) {
      const plan = filteredPlans[planIndex];
      setSelectedPlan(plan);
      onPlanSelect(plan.amount, plan.name);
      console.log(`プラン選択: ${plan.name}, 金額: ${plan.amount}`);
    }
  };
  
  // 人数に基づいて適切なプランインデックスを計算
  const getActivePlanIndex = (): number => {
    if (filteredPlans.length === 0) return 0;
    
    // 人数に一致するプランを探す
    for (let i = 0; i < filteredPlans.length; i++) {
      const plan = filteredPlans[i];
      if (size >= plan.min_party_size && size <= plan.max_party_size) {
        return i;
      }
    }
    
    // 見つからない場合はデフォルト
    return 0;
  };
  
  const getPlanLabel = (plan: PricePlan | null): string => {
    if (!plan) return '';
    
    return language === 'ko' 
      ? `${plan.min_party_size}-${plan.max_party_size}명` 
      : language === 'ja' 
      ? `${plan.min_party_size}-${plan.max_party_size}人` 
      : `${plan.min_party_size}-${plan.max_party_size} people`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <PricingInteraction
        starterMonth={1000}
        starterAnnual={10000}
        proMonth={2000}
        proAnnual={20000}
        pricePlans={filteredPlans}
        activePlan={getActivePlanIndex()}
        onPlanSelect={handleSelectPlan}
        language={language}
      />
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        {language === 'ko'
          ? '현재 선택된 인원수: '
          : language === 'ja'
          ? '現在選択された人数: '
          : 'Current selected party size: '}
        <span className="font-medium">{partySize}</span>
        {language === 'ko'
          ? '명'
          : language === 'ja'
          ? '人'
          : ' people'}
      </p>
      
      {selectedPlan && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {getPricePlanDescription(selectedPlan, language as 'ja' | 'ko' | 'en')}
        </p>
      )}
    </div>
  );
} 