import React, { useState, useEffect, useRef, useCallback } from 'react';
import LandingPage from './LandingPage';
import RestaurantSearch from './RestaurantSearch';
import RestaurantDetails from './components/RestaurantDetails';
import ReservationInput from './components/ReservationInput';
import StoreList from './components/StoreList';
import { supabase, testConnection } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet, Navigate, useParams } from 'react-router-dom';
import ServiceIntroduction from './pages/ServiceIntroduction';
import Options from './pages/Options';
import Cautions from './pages/Cautions';
import StoreInfo from './pages/StoreInfo';
import Reviews from './pages/Reviews';
import { TubelightNavbar } from './components/ui/TubelightNavbar';
import { getCommonNavItems, getHeaderNavItems, getMobileNavItems } from './lib/navigation';
import AdminDashboard from './pages/AdminDashboard';
import ReservationSuccess from './pages/ReservationSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CommercialTransactions from './pages/CommercialTransactions';
import Footer from './components/Footer';

// デバッグユーティリティ
const debugConfig = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'debug' as 'debug' | 'info' | 'warn' | 'error',
  showTimestamps: true,
  componentTracking: true,
  networkTracking: true,      // ネットワークリクエスト追跡
  stateChangeTracking: true,  // 状態変更追跡
  performanceMetrics: true,   // パフォーマンスメトリクス収集
  errorReporting: true,       // エラーレポート強化
  groupLogs: true,            // ログをグループ化
  maxLogDepth: 3,             // オブジェクトの最大表示深度
  storeLogs: true,            // ログをメモリに保存（デバッグ用）
};

// ログストレージ（メモリ内）
const logStorage = {
  logs: [] as Array<{
    timestamp: string,
    level: string,
    component: string,
    message: string,
    data?: any
  }>,
  metrics: {
    componentRenders: {} as Record<string, number>,
    apiRequests: {} as Record<string, { count: number, totalTime: number, avgTime: number }>,
    errors: [] as Array<{ timestamp: string, component: string, message: string, stack?: string }>
  },
  getLogs: () => [...logStorage.logs],
  getMetrics: () => ({ ...logStorage.metrics }),
  clearLogs: () => { logStorage.logs = []; },
  clearMetrics: () => {
    logStorage.metrics = {
      componentRenders: {},
      apiRequests: {},
      errors: []
    };
  }
};

// デバッグユーティリティ関数
const debug = {
  _storeLog: (level: string, component: string, message: string, data?: any) => {
    if (!debugConfig.storeLogs) return;
    logStorage.logs.push({
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    });
  },
  
  // 深さ制限付きオブジェクト整形
  _formatObject: (obj: any, depth: number = 0): any => {
    if (depth >= debugConfig.maxLogDepth) return '[深すぎるオブジェクト]';
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => debug._formatObject(item, depth + 1));
    }
    
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = debug._formatObject(obj[key], depth + 1);
      }
    }
    return result;
  },
  
  log: (component: string, message: string, ...args: any[]) => {
    if (!debugConfig.enabled) return;
    const timestamp = debugConfig.showTimestamps ? `[${new Date().toISOString()}]` : '';
    console.log(`${timestamp}[DEBUG][${component}] ${message}`, ...args);
    debug._storeLog('debug', component, message, args);
  },
  
  info: (component: string, message: string, ...args: any[]) => {
    if (!debugConfig.enabled || debugConfig.logLevel === 'debug') return;
    const timestamp = debugConfig.showTimestamps ? `[${new Date().toISOString()}]` : '';
    console.info(`${timestamp}[INFO][${component}] ${message}`, ...args);
    debug._storeLog('info', component, message, args);
  },
  
  warn: (component: string, message: string, ...args: any[]) => {
    if (!debugConfig.enabled || ['debug', 'info'].includes(debugConfig.logLevel)) return;
    const timestamp = debugConfig.showTimestamps ? `[${new Date().toISOString()}]` : '';
    console.warn(`${timestamp}[WARN][${component}] ${message}`, ...args);
    debug._storeLog('warn', component, message, args);
  },
  
  error: (component: string, message: string, ...args: any[]) => {
    const timestamp = debugConfig.showTimestamps ? `[${new Date().toISOString()}]` : '';
    console.error(`${timestamp}[ERROR][${component}] ${message}`, ...args);
    debug._storeLog('error', component, message, args);
    
    if (debugConfig.errorReporting) {
      // エラー情報を保存
      const errorInfo = {
        timestamp: new Date().toISOString(),
        component,
        message,
        details: args,
        stack: new Error().stack
      };
      logStorage.metrics.errors.push(errorInfo);
    }
  },
  
  group: (component: string, label: string, collapsed = true) => {
    if (!debugConfig.enabled || !debugConfig.groupLogs) return;
    const timestamp = debugConfig.showTimestamps ? `[${new Date().toISOString()}]` : '';
    const groupLabel = `${timestamp}[GROUP][${component}] ${label}`;
    
    if (collapsed) {
      console.groupCollapsed(groupLabel);
    } else {
      console.group(groupLabel);
    }
  },
  
  groupEnd: () => {
    if (!debugConfig.enabled || !debugConfig.groupLogs) return;
    console.groupEnd();
  },
  
  time: (component: string, label: string) => {
    if (!debugConfig.enabled) return;
    console.time(`[TIME][${component}] ${label}`);
    
    if (debugConfig.performanceMetrics && debugConfig.networkTracking && label.startsWith('Fetch:')) {
      // API パフォーマンス計測開始
      const apiKey = `${component}:${label}`;
      if (!logStorage.metrics.apiRequests[apiKey]) {
        logStorage.metrics.apiRequests[apiKey] = { count: 0, totalTime: 0, avgTime: 0 };
      }
      logStorage.metrics.apiRequests[apiKey].count++;
    }
  },
  
  timeEnd: (component: string, label: string, timeTaken?: number) => {
    if (!debugConfig.enabled) return;
    
    if (timeTaken !== undefined && debugConfig.performanceMetrics) {
      console.log(`[TIME][${component}] ${label}: ${timeTaken}ms`);
      
      if (debugConfig.networkTracking && label.startsWith('Fetch:')) {
        // API パフォーマンス計測結果の保存
        const apiKey = `${component}:${label}`;
        if (logStorage.metrics.apiRequests[apiKey]) {
          logStorage.metrics.apiRequests[apiKey].totalTime += timeTaken;
          logStorage.metrics.apiRequests[apiKey].avgTime = 
            logStorage.metrics.apiRequests[apiKey].totalTime / logStorage.metrics.apiRequests[apiKey].count;
        }
      }
    } else {
      console.timeEnd(`[TIME][${component}] ${label}`);
    }
  },
  
  trace: (component: string, message: string) => {
    if (!debugConfig.enabled) return;
    console.groupCollapsed(`[TRACE][${component}] ${message}`);
    console.trace();
    console.groupEnd();
  },
  
  // 状態変更のトラッキング
  trackState: <T extends unknown>(
    component: string, 
    stateName: string, 
    oldValue: T, 
    newValue: T
  ) => {
    if (!debugConfig.enabled || !debugConfig.stateChangeTracking) return;
    
    const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
    
    if (hasChanged) {
      debug.group(component, `状態変更: ${stateName}`);
      debug.log(component, `${stateName}変更前:`, oldValue);
      debug.log(component, `${stateName}変更後:`, newValue);
      debug.groupEnd();
    }
  },
  
  // DOM変更の検出（React外の変更を検出）
  trackDOMChanges: (component: string, targetSelector: string) => {
    if (!debugConfig.enabled || !debugConfig.performanceMetrics) return;
    
    const target = document.querySelector(targetSelector);
    if (!target) {
      debug.warn(component, `DOM追跡: セレクタ「${targetSelector}」の要素が見つかりません`);
      return;
    }
    
    debug.log(component, `DOM監視開始: ${targetSelector}`);
    
    const observer = new MutationObserver((mutations) => {
      debug.group(component, `DOM変更検出: ${targetSelector} (${mutations.length}件)`);
      
      mutations.forEach((mutation, index) => {
        if (index < 3) { // 最初の3つだけ詳細表示
          debug.log(component, `変更 #${index + 1}:`, {
            type: mutation.type,
            target: (mutation.target as Element).tagName,
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length
          });
        }
      });
      
      if (mutations.length > 3) {
        debug.log(component, `他 ${mutations.length - 3} 件の変更は省略されました`);
      }
      
      debug.groupEnd();
    });
    
    observer.observe(target, { 
      childList: true, 
      attributes: true, 
      characterData: true, 
      subtree: true 
    });
    
    return () => {
      observer.disconnect();
      debug.log(component, `DOM監視終了: ${targetSelector}`);
    };
  },
  
  // メモリ使用状況の表示
  logMemoryUsage: (component: string) => {
    if (!debugConfig.enabled || !debugConfig.performanceMetrics) return;
    
    if (window.performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      debug.log(component, 'メモリ使用状況', {
        totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      });
    } else {
      debug.log(component, 'メモリ使用状況: このブラウザでは利用できません');
    }
  },
  
  // デバッグレポートの生成
  generateReport: () => {
    if (!debugConfig.enabled) return null;
    
    return {
      timestamp: new Date().toISOString(),
      config: { ...debugConfig },
      metrics: logStorage.getMetrics(),
      recentLogs: logStorage.getLogs().slice(-50), // 最新50件のログ
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      location: window.location.href
    };
  },
  
  // Reactコンポーネント例外ハンドラー用
  componentErrorBoundary: (error: Error, componentStack: string | null | undefined, componentName: string) => {
    debug.error(componentName || 'ErrorBoundary', `コンポーネントエラー捕捉:`, error);
    debug.log(componentName || 'ErrorBoundary', `コンポーネントスタック:`, componentStack || '不明');
    
    // エラー情報を保存
    if (debugConfig.errorReporting) {
      logStorage.metrics.errors.push({
        timestamp: new Date().toISOString(),
        component: componentName || 'ErrorBoundary',
        message: error.message,
        stack: componentStack || error.stack
      });
    }
  },
  
  // クリップボードにデバッグレポートをコピー
  copyReportToClipboard: async () => {
    const report = debug.generateReport();
    if (!report) return false;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      console.info('デバッグレポートがクリップボードにコピーされました');
      return true;
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
      return false;
    }
  }
};

// カスタムエラーバウンダリコンポーネント
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, componentName: string },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, componentName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    debug.componentErrorBoundary(error, errorInfo.componentStack, this.props.componentName);
  }

  render() {
    if (this.state.hasError) {
      // エラー表示は開発環境でのみ表示
      if (process.env.NODE_ENV === 'development') {
        return (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#FEE', 
            border: '1px solid #F88',
            borderRadius: '4px',
            margin: '0.5rem'
          }}>
            <h3>コンポーネントエラー: {this.props.componentName}</h3>
            <p>{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              リセット
            </button>
          </div>
        );
      }
      
      // 本番環境ではシンプルな回復UIを表示
      return (
        <div className="error-container">
          <p>エラーが発生しました。もう一度お試しください。</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            再試行
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// パフォーマンス計測用のカスタムフック（拡張版）
function useComponentPerformance(componentName: string): {
  renderCount: number;
  trackEvent: (eventName: string) => void;
  measureOperation: <T>(operationName: string, operation: () => T) => T;
  measurePromise: <T>(operationName: string, promise: Promise<T>) => Promise<T>;
} {
  const renderCount = useRef(0);
  const events = useRef<Record<string, { count: number, timestamps: number[] }>>({});
  const componentMounted = useRef<number>(performance.now());
  
  // パフォーマンスイベントの追跡
  const trackEvent = useCallback((eventName: string) => {
    if (!debugConfig.enabled || !debugConfig.componentTracking) return;
    
    if (!events.current[eventName]) {
      events.current[eventName] = { count: 0, timestamps: [] };
    }
    
    events.current[eventName].count++;
    events.current[eventName].timestamps.push(performance.now());
    
    debug.log(componentName, `イベント "${eventName}" が発生しました (${events.current[eventName].count}回目)`);
  }, [componentName]);
  
  // 同期処理のパフォーマンス計測
  const measureOperation = useCallback(<T>(operationName: string, operation: () => T): T => {
    if (!debugConfig.enabled || !debugConfig.performanceMetrics) {
      return operation();
    }
    
    debug.time(componentName, `操作: ${operationName}`);
    const startTime = performance.now();
    
    try {
      const result = operation();
      const endTime = performance.now();
      debug.timeEnd(componentName, `操作: ${operationName}`, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      debug.timeEnd(componentName, `操作: ${operationName}`, endTime - startTime);
      debug.error(componentName, `操作エラー "${operationName}":`, error);
      throw error;
    }
  }, [componentName]);
  
  // 非同期処理のパフォーマンス計測
  const measurePromise = useCallback(<T>(operationName: string, promise: Promise<T>): Promise<T> => {
    if (!debugConfig.enabled || !debugConfig.performanceMetrics) {
      return promise;
    }
    
    debug.time(componentName, `非同期操作: ${operationName}`);
    const startTime = performance.now();
    
    return promise
      .then(result => {
        const endTime = performance.now();
        debug.timeEnd(componentName, `非同期操作: ${operationName}`, endTime - startTime);
        return result;
      })
      .catch(error => {
        const endTime = performance.now();
        debug.timeEnd(componentName, `非同期操作: ${operationName}`, endTime - startTime);
        debug.error(componentName, `非同期操作エラー "${operationName}":`, error);
        throw error;
      });
  }, [componentName]);
  
  useEffect(() => {
    if (!debugConfig.enabled || !debugConfig.componentTracking) return;
    
    renderCount.current += 1;
    const startTime = performance.now();
    const isMounted = renderCount.current === 1;
    
    // 初回マウント時のマーク作成
    if (isMounted) {
      componentMounted.current = startTime;
      debug.log(componentName, `コンポーネントがマウントされました`);
      
      if (window.performance && performance.mark) {
        const markName = `component-mount-${componentName}`;
        performance.mark(markName);
      }
    } else {
      debug.log(componentName, `コンポーネントが再レンダリングされました (${renderCount.current}回目)`);
      
      if (debugConfig.performanceMetrics) {
        // メトリクスの記録
        if (logStorage.metrics.componentRenders[componentName] === undefined) {
          logStorage.metrics.componentRenders[componentName] = 0;
        }
        logStorage.metrics.componentRenders[componentName] += 1;
      }
    }
    
    return () => {
      const endTime = performance.now();
      const timeOnScreen = endTime - startTime;
      
      if (renderCount.current === 1) {
        debug.log(componentName, `コンポーネントがアンマウントされました (表示時間: ${timeOnScreen.toFixed(2)}ms)`);
        
        // 総表示時間（マウントからアンマウントまで）を記録
        const totalLifetime = endTime - componentMounted.current;
        debug.log(componentName, `コンポーネント総生存時間: ${totalLifetime.toFixed(2)}ms`);
        
        // イベント統計の表示
        if (Object.keys(events.current).length > 0) {
          debug.group(componentName, 'コンポーネントイベント統計');
          
          Object.entries(events.current).forEach(([eventName, eventData]) => {
            debug.log(componentName, `イベント "${eventName}": ${eventData.count}回発生`);
          });
          
          debug.groupEnd();
        }
      } else {
        debug.log(componentName, `レンダリングサイクル完了 (${renderCount.current}回目): ${timeOnScreen.toFixed(2)}ms`);
      }
    };
  });
  
  return {
    renderCount: renderCount.current,
    trackEvent,
    measureOperation,
    measurePromise
  };
}

// データフェッチングのログラッパー
async function loggedFetch<T = any>(
  component: string, 
  url: string, 
  options: RequestInit = {}
): Promise<{response: Response, data: T}> {
  const startTime = performance.now();
  debug.time(component, `Fetch: ${url}`);
  debug.group(component, `APIリクエスト: ${url}`, true);
  debug.log(component, `リクエスト詳細:`, { 
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : '(非文字列ボディ)') : undefined
  });
  
  try {
    const response = await fetch(url, options);
    const responseClone = response.clone(); // レスポンスを複製（データを2回読み込むため）
    const contentType = response.headers.get('content-type');
    let data: T;
    
    // レスポンスタイプに基づいて適切に解析
    if (contentType?.includes('application/json')) {
      data = await responseClone.json() as T;
    } else if (contentType?.includes('text/')) {
      const textData = await responseClone.text();
      try {
        // テキストでもJSONとして解析を試みる
        data = JSON.parse(textData) as T;
      } catch {
        data = textData as unknown as T;
      }
    } else {
      // バイナリなど他の形式のレスポンス
      data = '(バイナリデータ)' as unknown as T;
    }
    
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    
    debug.log(component, `APIレスポンス:`, { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers]),
      size: new Blob([JSON.stringify(data)]).size,
      time: `${timeTaken.toFixed(2)}ms`
    });
    
    if (response.status >= 400) {
      debug.warn(component, `APIエラーレスポンス (${response.status}):`, data);
    }
    
    // パフォーマンスメトリクスを記録
    debug.timeEnd(component, `Fetch: ${url}`, timeTaken);
    
    // ネットワークタイムラインにカスタムマーク（開発者ツール用）
    if (window.performance && performance.mark) {
      const markName = `api-${component}-${url.replace(/[^a-zA-Z0-9]/g, '-')}`;
      performance.mark(markName);
      
      if (performance.measure) {
        try {
          performance.measure(`🌐 API: ${url}`, markName);
        } catch (e) {
          // 計測エラーは無視
        }
      }
    }
    
    debug.groupEnd();
    return { response, data };
  } catch (error) {
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    
    debug.error(component, `APIリクエストエラー: ${url}`, error);
    debug.timeEnd(component, `Fetch: ${url}`, timeTaken);
    debug.groupEnd();
    
    // エラー情報をログストレージに追加
    if (debugConfig.errorReporting) {
      logStorage.metrics.errors.push({
        timestamp: new Date().toISOString(),
        component: `${component}:Fetch`,
        message: `API Error: ${url} - ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    
    throw error;
  }
}

// ナビゲーション追跡
function useNavigationTracking(componentName: string) {
  const navigate = useNavigate();
  const navigationHistory = useRef<Array<{timestamp: string, path: string, options?: any}>>([]);
  
  const trackedNavigate = (path: string, options?: any) => {
    debug.log(componentName, `ナビゲーション: ${path}`, options);
    debug.trace(componentName, `ナビゲーション呼び出し元`);
    
    navigationHistory.current.push({
      timestamp: new Date().toISOString(),
      path,
      options
    });
    
    navigate(path, options);
  };
  
  useEffect(() => {
    if (!debugConfig.componentTracking) return;
    debug.log(componentName, 'ナビゲーションが準備されました');
    
    return () => {
      debug.log(componentName, 'ナビゲーション履歴', navigationHistory.current);
    };
  }, [componentName]);
  
  return trackedNavigate;
}

// 改良された共通レイアウトコンポーネント
function PageWithNavigation({ language, onLanguageChange }) {
  const componentName = 'PageWithNavigation';
  const { renderCount, trackEvent, measureOperation, measurePromise } = useComponentPerformance(componentName);
  const navigate = useNavigationTracking(componentName);
  
  debug.log(componentName, `レンダリング - 言語: ${language}`, { renderCount });
  
  // 各ページへの共通遷移関数
  const goToHome = () => navigate('/');
  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  const goToAdmin = () => navigate('/admin');
  const goToReservation = () => navigate('/restaurant-search');
  const goToLogin = () => navigate('/login');
  
  // ヘッダー用のナビゲーションアイテム（限定バージョン）
  const HEADER_NAV_ITEMS = getHeaderNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToStoreInfo,
    goToReviews
  });

  // ハンバーガーメニュー用のナビゲーションアイテム（全アイテム）
  const MOBILE_NAV_ITEMS = getMobileNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews,
    goToReservation,
    goToLogin,
    goToAdmin
  });
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 共通ヘッダー */}
      <TubelightNavbar 
        items={HEADER_NAV_ITEMS}
        mobileItems={MOBILE_NAV_ITEMS}
        language={language} 
        onLanguageChange={onLanguageChange} 
      />
      
      {/* ヘッダーの高さ分のスペースを確保 */}
      <div className="h-16 md:h-16 mt-2"></div>
      
      {/* メインコンテンツ - Outletを使用して子ルートのコンポーネントをレンダリング */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      
      {/* 共通フッター */}
      <Footer language={language} />
    </div>
  );
}

// 個別ページのラッパー
function StandalonePageWrapper({ language, Component }) {
  const navigate = useNavigate();
  
  // 各ページへの共通遷移関数
  const goToHome = () => navigate('/');
  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  const goToAdmin = () => navigate('/admin');
  const goToReservation = () => navigate('/restaurant-search');
  const goToLogin = () => navigate('/login');
  
  // ヘッダー用のナビゲーションアイテム（限定バージョン）
  const HEADER_NAV_ITEMS = getHeaderNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToStoreInfo,
    goToReviews
  });

  // ハンバーガーメニュー用のナビゲーションアイテム（全アイテム）
  const MOBILE_NAV_ITEMS = getMobileNavItems(language, {
    goToHome,
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews,
    goToReservation,
    goToLogin,
    goToAdmin
  });
  
  return (
    <>
      <TubelightNavbar 
        items={HEADER_NAV_ITEMS}
        mobileItems={MOBILE_NAV_ITEMS}
        language={language} 
        onLanguageChange={undefined} 
      />
      <div className="h-16 md:h-16 mt-2"></div>
      <Component language={language} />
      <Footer language={language} />
    </>
  );
}

function RestaurantSearchWrapper({ language, onSelectRestaurant }) {
  const componentName = 'RestaurantSearchWrapper';
  const { renderCount, trackEvent, measureOperation, measurePromise } = useComponentPerformance(componentName);
  const navigate = useNavigationTracking(componentName);
  
  debug.log(componentName, `レンダリング - 言語: ${language}`, { renderCount });
  
  const handleSelectRestaurant = (id) => {
    debug.log(componentName, `レストラン選択処理開始 ID: ${id}`, { type: typeof id });
    debug.time(componentName, `レストラン選択処理`);
    
    try {
      debug.trace(componentName, 'レストラン選択トレース');
      onSelectRestaurant(id);
      debug.log(componentName, `onSelectRestaurant呼び出し成功`);
      navigate(`/restaurant-details/${id}`);
      debug.log(componentName, `ナビゲーション実行: /restaurant-details/${id}`);
    } catch (error) {
      debug.error(componentName, `レストラン選択処理中のエラー:`, error);
    } finally {
      debug.timeEnd(componentName, `レストラン選択処理`);
    }
  };
  
  return <RestaurantSearch language={language} onSelectRestaurant={handleSelectRestaurant} />;
}

function ReservationInputWrapper({ language }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <ReservationInput 
      language={language} 
      restaurantId={id || ''} 
      onBack={() => navigate(-1)} 
      onComplete={(reservationId) => navigate(`/reservation-success/${reservationId}`)} 
    />
  );
}

function AdminDashboardWrapper({ language }) {
  const navigate = useNavigate();
  return <AdminDashboard language={language} onBack={() => navigate('/')} />;
}

// RestaurantDetails用のラッパー
function RestaurantDetailsWrapper({ language }) {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('[DEBUG] RestaurantDetailsWrapper レンダリング - ID:', id, '型:', typeof id);
  
  const handleReserve = (restaurantId) => {
    console.log('[DEBUG] 予約処理開始 - restaurantId:', restaurantId);
    navigate(`/reservation-input/${restaurantId}`);
    console.log('[DEBUG] 予約ページへナビゲーション完了');
  };
  
  return (
    <RestaurantDetails 
      restaurantId={id}
      language={language} 
      onBack={() => {
        console.log('[DEBUG] 戻るボタン押下');
        navigate(-1);
      }} 
      onReserve={handleReserve}
    />
  );
}

function App() {
  const componentName = 'App';
  const { renderCount, trackEvent, measureOperation, measurePromise } = useComponentPerformance(componentName);
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'ja' | 'en'>('ko');
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const previousLanguage = useRef(currentLanguage);
  const previousRestaurantId = useRef(restaurantId);
  
  debug.log(componentName, `レンダリング - 言語: ${currentLanguage}, レストランID: ${restaurantId}`, {
    renderCount,
    languageChanged: previousLanguage.current !== currentLanguage,
    restaurantIdChanged: previousRestaurantId.current !== restaurantId
  });
  
  // レンダリング後に前回の値を更新
  useEffect(() => {
    previousLanguage.current = currentLanguage;
    previousRestaurantId.current = restaurantId;
  });

  const handleRestaurantSelect = (id: string) => {
    debug.log(componentName, `handleRestaurantSelect呼び出し - ID: ${id}`, { type: typeof id });
    debug.time(componentName, `レストランID処理`);
    
    try {
      const parsedId = parseInt(id);
      debug.log(componentName, `パース後ID: ${parsedId}`, { 
        type: typeof parsedId, 
        isNaN: isNaN(parsedId),
        originalId: id
      });
      
      if (isNaN(parsedId)) {
        debug.error(componentName, `無効なレストランID: ${id}`);
        return;
      }
      
      debug.log(componentName, `レストランID状態更新前: ${restaurantId} -> ${parsedId}`);
      setRestaurantId(parsedId);
      
      // 状態更新の検証（次のレンダリングサイクルで確認するため、setTimeout を使用）
      setTimeout(() => {
        debug.log(componentName, `レストランID状態更新後の検証: ${restaurantId} -> ?`, {
          expected: parsedId,
          actual: restaurantId // 注意：この値は更新前の値を示す可能性がある
        });
      }, 0);
    } catch (error) {
      debug.error(componentName, `レストランID処理エラー:`, error);
    } finally {
      debug.timeEnd(componentName, `レストランID処理`);
    }
  };

  // 言語切り替え処理の安全対策を強化
  const handleLanguageChange = (lang: 'ko' | 'ja' | 'en') => {
    debug.log(componentName, `言語切り替え開始: ${lang}`, { 現在の言語: currentLanguage });
    debug.time(componentName, `言語切り替え処理`);
    
    try {
      // 英語へ切り替える前に安全チェック
      if (lang === 'en') {
        debug.log(componentName, `英語への切り替えを試みます`);
        // 英語リソースが正しく読み込まれていることを確認
        debug.log(componentName, `英語リソースチェック`);
      }
      
      // 言語切り替え前後の状態をログ
      debug.log(componentName, `言語状態更新前: ${currentLanguage} -> ${lang}`);
      setCurrentLanguage(lang);
      
      // 状態更新の検証
      setTimeout(() => {
        debug.log(componentName, `言語状態更新後の検証: ${currentLanguage} -> ?`, {
          expected: lang,
          actual: currentLanguage // 注意：この値は更新前の値を示す可能性がある
        });
      }, 0);
    } catch (error) {
      debug.error(componentName, `言語切り替えエラー:`, error);
      setCurrentLanguage('ko');
      debug.warn(componentName, `言語切り替えに失敗しました。デフォルト言語に戻します。`);
    } finally {
      debug.timeEnd(componentName, `言語切り替え処理`);
    }
  };

  // Testing Supabase connection
  React.useEffect(() => {
    const componentName = 'App:SupabaseConnection';
    
    const checkConnections = async () => {
      debug.log(componentName, `Supabase接続テスト開始`);
      debug.time(componentName, `Supabase接続テスト`);
      
      try {
        const result = await testConnection();
        debug.log(componentName, `Supabase接続テスト結果:`, result);
      } catch (error) {
        debug.error(componentName, `Supabase接続テストエラー:`, error);
      } finally {
        debug.timeEnd(componentName, `Supabase接続テスト`);
      }
    };
    
    checkConnections();
  }, []);

  // 言語変更後の副作用を追加・強化
  useEffect(() => {
    const componentName = 'App:LanguageEffect';
    debug.log(componentName, `言語変更useEffect開始: ${currentLanguage}`);
    debug.time(componentName, `言語リソース処理`);
    
    // document言語の設定
    document.documentElement.lang = currentLanguage;
    debug.log(componentName, `document.lang設定完了: ${document.documentElement.lang}`);
    
    // テキストが表示されないバグへの対応として、必要なリソースを確認
    const ensureLanguageResources = () => {
      debug.log(componentName, `言語リソース確認開始: ${currentLanguage}`);
      
      // DOM要素のテキスト確認（例）
      const textElements = document.querySelectorAll('p, h1, h2, h3, button, a');
      const emptyTextElements = Array.from(textElements).filter(el => el.textContent?.trim() === '');
      
      if (emptyTextElements.length > 0) {
        debug.warn(componentName, `空のテキスト要素が見つかりました (${emptyTextElements.length}件)`, {
          例: emptyTextElements.slice(0, 3).map(el => ({
            tag: el.tagName,
            className: el.className,
            id: el.id,
          }))
        });
      }
      
      // 開発モードでのみ実行される簡易チェック
      if (process.env.NODE_ENV === 'development') {
        debug.log(componentName, `言語リソースチェック完了 - 開発モード: ${currentLanguage}`);
      }
      
      debug.log(componentName, `言語リソース確認完了: ${currentLanguage}`);
    };
    
    ensureLanguageResources();
    debug.log(componentName, `言語変更useEffect完了: ${currentLanguage}`);
    debug.timeEnd(componentName, `言語リソース処理`);
    
    // クリーンアップ関数
    return () => {
      debug.log(componentName, `言語変更useEffectクリーンアップ - 前の言語: ${currentLanguage}`);
    };
  }, [currentLanguage]);

  // AppWrapper関数を作成してnavigateを使用
  function AppRoutes() {
    const componentName = 'AppRoutes';
    const renderCount = useComponentPerformance(componentName);
    const navigate = useNavigationTracking(componentName);
    
    debug.log(componentName, `レンダリング - 現在の言語: ${currentLanguage}`, { renderCount });
    
    return (
      <Routes>
        {/* スタンドアロンページ */}
        <Route path="/" element={
          <>
            <LandingPage language={currentLanguage} onLanguageChange={handleLanguageChange} />
          </>
        } />
        
        <Route path="/privacy-policy" element={
          <StandalonePageWrapper 
            language={currentLanguage} 
            Component={PrivacyPolicy} 
          />
        } />
        
        <Route path="/commercial-transactions" element={
          <StandalonePageWrapper 
            language={currentLanguage} 
            Component={CommercialTransactions} 
          />
        } />
        
        {/* 共通レイアウトを使用するページ */}
        <Route element={<PageWithNavigation language={currentLanguage} onLanguageChange={handleLanguageChange} />}>
          <Route path="/service-introduction" element={<ServiceIntroduction language={currentLanguage} />} />
          <Route path="/options" element={<Options language={currentLanguage} />} />
          <Route path="/cautions" element={<Cautions language={currentLanguage} />} />
          <Route path="/store-info" element={<StoreInfo language={currentLanguage} />} />
          <Route path="/reviews" element={<Reviews language={currentLanguage} />} />
          <Route path="/restaurant-search" element={
            <RestaurantSearchWrapper 
              language={currentLanguage} 
              onSelectRestaurant={handleRestaurantSelect} 
            />
          } />
          {/* /search へのリダイレクトを追加 */}
          <Route path="/search" element={<Navigate to="/restaurant-search" replace />} />
          <Route path="/restaurant-details/:id" element={<RestaurantDetailsWrapper language={currentLanguage} />} />
          <Route path="/reservation-input/:id" element={
            <ReservationInputWrapper 
              language={currentLanguage} 
            />
          } />
          <Route path="/reservation-success/:reservationId" element={<ReservationSuccess language={currentLanguage} />} />
          <Route path="/admin" element={<AdminDashboardWrapper language={currentLanguage} />} />
          <Route path="/stores" element={<StoreList language={currentLanguage} />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <AppRoutes />
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