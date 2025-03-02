// Service Worker for IRU TOMO Reservation PWA
const CACHE_NAME = 'irutomo-cache-v2';
const DYNAMIC_CACHE = 'irutomo-dynamic-v2';
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/iru-logo.svg',
  '/manifest.json'
];

// キャッシュから除外するパターン
const EXCLUDE_FROM_CACHE = [
  // API呼び出し
  /\/api\//,
  // JSONデータ
  /\.json$/,
  // PayPalやOAuth関連
  /paypal/i,
  /oauth/i,
  // 開発関連
  /localhost/,
  /127\.0\.0\.1/
];

// インストール時にリソースをキャッシュ
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  // 直ちに新しいサービスワーカーをアクティブにする
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
  );
});

// キャッシュから除外すべきかを判断
function shouldExcludeFromCache(url) {
  return EXCLUDE_FROM_CACHE.some(pattern => pattern.test(url));
}

// ネットワークファースト戦略
// 最初にネットワークからデータを取得し、失敗した場合のみキャッシュを使用
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const networkResponse = await fetch(request);
    // ステータスが正常でキャッシュすべきリクエストの場合
    if (networkResponse.ok && !shouldExcludeFromCache(request.url)) {
      // レスポンスをクローンしてキャッシュ
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network request failed, falling back to cache', error);
    const cachedResponse = await cache.match(request);
    return cachedResponse || caches.match('/index.html');
  }
}

// キャッシュファースト戦略
// 最初にキャッシュからデータを取得し、見つからない場合はネットワークからフェッチ
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // ステータスが正常でキャッシュすべきリクエストの場合
    if (networkResponse.ok && !shouldExcludeFromCache(request.url)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network request failed and no cache available', error);
    return caches.match('/index.html');
  }
}

// フェッチイベントの処理
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // HTMLファイルのリクエストの場合は常にネットワークを優先
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
  }
  // 静的アセットの場合はキャッシュ優先
  else if (STATIC_RESOURCES.some(url => request.url.endsWith(url)) || 
           request.url.match(/\.(js|css|svg|woff2)$/)) {
    event.respondWith(cacheFirst(request));
  }
  // その他のリクエストはネットワーク優先
  else {
    event.respondWith(networkFirst(request));
  }
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  // 新しいサービスワーカーをすぐに制御状態にする
  event.waitUntil(self.clients.claim());
  
  // 古いキャッシュの削除
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('irutomo-') && 
                  cacheName !== CACHE_NAME && 
                  cacheName !== DYNAMIC_CACHE;
          })
          .map(cacheName => {
            console.log('Deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
}); 