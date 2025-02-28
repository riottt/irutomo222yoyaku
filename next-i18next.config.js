const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    localePath: path.resolve('./public/locales'),
    localeDetection: false, // ブラウザの言語設定に自動的に合わせない
  },
  // 特定のパスに対する言語設定を明示的に追加
  // 「*」は全てのページ、「/」はトップページのみを示す
  ns: ['common', 'landing'],
  defaultNS: 'common',
  pages: {
    '*': ['common'],
    '/': ['common', 'landing'],
  }
} 