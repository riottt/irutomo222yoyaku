import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle, CheckCircle, XCircle, Clock, Filter, Search, RefreshCw } from 'lucide-react';

// 環境変数からSupabaseの設定を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの初期化
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 予約の型定義
interface Reservation {
  id: string;
  created_at: string;
  restaurant_name: string;
  reservation_date: string;
  reservation_time: string;
  number_of_people: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  status: string;
  payment_id?: string;
}

// エラーログの型定義
interface ErrorLog {
  id: string;
  created_at: string;
  error_message: string;
  error_stack?: string;
  user_email?: string;
  reservation_id?: string;
}

// ステータスオプション
const statusOptions = [
  { value: 'pending', label: '保留中', icon: <Clock className="w-4 h-4 mr-1" /> },
  { value: 'confirmed', label: '確認済み', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
  { value: 'cancelled', label: 'キャンセル', icon: <XCircle className="w-4 h-4 mr-1" /> },
  { value: 'completed', label: '完了', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
];

interface StaffDashboardProps {
  language: 'ko' | 'ja';
  onBack: () => void;
  onLanguageToggle: () => void;
}

export function StaffDashboard({ language, onBack, onLanguageToggle }: StaffDashboardProps) {
  // 状態管理
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  // AuthContextから認証情報を取得
  const { isAdmin, isLoading: authLoading, user } = useAuth();

  // 予約データの取得
  const fetchReservations = async () => {
    if (authLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/get-reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          page: 1,
          limit: 100,
          filters: {}
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations);
      } else {
        console.error('予約データの取得に失敗しました');
      }
    } catch (error) {
      console.error('予約データの取得中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // データの再読み込み
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (activeTab === 'reservations') {
      await fetchReservations();
    } else {
      await fetchErrorLogs();
    }
    setIsRefreshing(false);
  };
  
  // 初回読み込み
  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchReservations();
    }
  }, [authLoading, isAdmin]);

  // エラーログの取得
  const fetchErrorLogs = async () => {
    if (authLoading) return;
    
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/get-errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          page: 1,
          limit: 50,
          filters: {}
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setErrorLogs(data.errors);
      } else {
        console.error('エラーログの取得に失敗しました');
      }
    } catch (error) {
      console.error('エラーログの取得中にエラーが発生しました:', error);
    }
  };
  
  // タブ切り替え時にデータ取得
  useEffect(() => {
    if (!authLoading && isAdmin && activeTab === 'errors') {
      fetchErrorLogs();
    }
  }, [activeTab, authLoading, isAdmin]);

  // 予約ステータスの更新
  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/update-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          status: newStatus
        })
      });
      
      if (response.ok) {
        // 予約リストを更新
        setReservations(prevReservations => 
          prevReservations.map(reservation => 
            reservation.id === reservationId 
              ? { ...reservation, status: newStatus } 
              : reservation
          )
        );
        alert('予約ステータスが更新されました');
      } else {
        alert('予約ステータスの更新に失敗しました');
      }
    } catch (error) {
      console.error('予約ステータス更新中にエラーが発生しました:', error);
      alert('予約ステータスの更新中にエラーが発生しました');
    }
  };

  // 予約のフィルタリング
  const filteredReservations = reservations.filter(reservation => {
    // 検索語でフィルタリング
    const searchMatch = 
      reservation.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // ステータスでフィルタリング
    const statusMatch = statusFilter === 'all' || reservation.status === statusFilter;
    
    // 日付でフィルタリング
    const dateMatch = !dateFilter || reservation.reservation_date === dateFilter;
    
    return searchMatch && statusMatch && dateMatch;
  });

  // 認証読み込み中の表示
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">読み込み中...</h2>
          <p className="text-gray-600 dark:text-gray-300">認証情報を確認しています</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合はログインを促す
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">スタッフログイン</h2>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-300">このページはスタッフ専用です。ログインしてください。</p>
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {/* ログインモーダルを表示する処理 */}}
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  // 管理者でない場合はアクセス拒否
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4 text-center">アクセス拒否</h2>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-300">このページは管理者専用です。アクセス権限がありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">スタッフダッシュボード</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          データを更新
        </button>
      </div>
      
      {/* タブナビゲーション */}
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'reservations' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('reservations')}
        >
          予約一覧
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'errors' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('errors')}
        >
          エラーログ
        </button>
      </div>
      
      {/* 予約一覧タブ */}
      {activeTab === 'reservations' && (
        <div>
          {/* フィルターセクション */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="レストラン名、顧客名、メールで検索"
                className="w-full pl-10 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">すべてのステータス</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="date"
                className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
          
          {/* 予約テーブル */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-300">予約データを読み込み中...</p>
            </div>
          ) : filteredReservations.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">レストラン</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">予約日時</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">人数</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">顧客名</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">連絡先</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ステータス</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-4 whitespace-nowrap">{reservation.restaurant_name}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {reservation.reservation_date} {reservation.reservation_time}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">{reservation.number_of_people}名</td>
                      <td className="py-4 px-4 whitespace-nowrap">{reservation.user_name}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">{reservation.user_email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.user_phone}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          reservation.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {statusOptions.find(option => option.value === reservation.status)?.icon}
                          {statusOptions.find(option => option.value === reservation.status)?.label || reservation.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          className="p-1 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700"
                          value={reservation.status}
                          onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400">予約が見つかりませんでした</p>
            </div>
          )}
        </div>
      )}
      
      {/* エラーログタブ */}
      {activeTab === 'errors' && (
        <div>
          {errorLogs.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日時</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">エラーメッセージ</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ユーザーメール</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">予約ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {errorLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString('ja-JP')}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{log.error_message}</div>
                        {log.error_stack && (
                          <details className="mt-1">
                            <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">スタックトレース</summary>
                            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                              {log.error_stack}
                            </pre>
                          </details>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">{log.user_email || '-'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{log.reservation_id || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400">エラーログが見つかりませんでした</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
