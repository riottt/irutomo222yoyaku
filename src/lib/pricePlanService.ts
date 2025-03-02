import { supabase } from './supabase';
import { PricePlan } from '../types/pricePlan';

/**
 * すべての料金プランを取得
 */
export async function getAllPricePlans(): Promise<PricePlan[]> {
  try {
    const { data, error } = await supabase
      .from('price_plans')
      .select('*')
      .eq('is_active', true)
      .order('min_party_size', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('料金プランの取得中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 人数に基づいた料金プランを取得
 */
export async function getPricePlanByPartySize(partySize: number): Promise<PricePlan | null> {
  try {
    const { data, error } = await supabase
      .from('price_plans')
      .select('*')
      .eq('is_active', true)
      .lte('min_party_size', partySize)
      .gte('max_party_size', partySize)
      .single();

    if (error) throw error;
    return data as PricePlan;
  } catch (error) {
    console.error('人数に基づく料金プランの取得中にエラーが発生しました:', error);
    return null;
  }
}

/**
 * プランIDによる料金プランの取得
 */
export async function getPricePlanById(planId: string): Promise<PricePlan | null> {
  try {
    const { data, error } = await supabase
      .from('price_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching price plan by ID:', error);
    return null;
  }
}

/**
 * 人数からオンラインで金額を計算（Supabase接続なし）
 * バックアップまたは接続エラー時に使用
 */
export function calculatePriceByPartySizeOffline(partySize: number): number {
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