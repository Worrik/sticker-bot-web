export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.sticker-bot.pp.ua'

export function getWebAppInitData(): string {
  const initData = window.Telegram?.WebApp?.initData
  if (initData && initData !== 'query_id') return initData;
  const hash = window.location.hash;
  if (!hash.includes('tgWebAppData=')) return '';
  return hash.split('tgWebAppData=')[1].split('&tgWebAppVersion')[0];
}