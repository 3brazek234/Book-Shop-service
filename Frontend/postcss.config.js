// postcss.config.js
module.exports = {
  plugins: {
    // 🚨 هنا التعديل: استبدل 'tailwindcss' بـ '@tailwindcss/postcss'
    '@tailwindcss/postcss': {},
    // أي plugins تانية لو عندك
  },
};