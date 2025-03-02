import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// サービスワーカーの管理
if ('serviceWorker' in navigator) {
  // 開発モードの場合はサービスワーカーを登録解除
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('ServiceWorker unregistered for development mode');
          // ページをリロードしてキャッシュをクリア
          if (window.caches) {
            caches.keys().then(cacheNames => {
              cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
                console.log(`Cache ${cacheName} deleted`);
              });
            });
          }
        });
      }
    });
  } else {
    // 本番環境でのみサービスワーカーを登録
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', {
        updateViaCache: 'none' // ブラウザのHTTPキャッシュを使用せずに更新をチェック
      })
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // サービスワーカーの更新を定期的にチェック
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // 1時間ごとに更新をチェック
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
