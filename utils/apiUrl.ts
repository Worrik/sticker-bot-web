export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.sticker-bot.pp.ua'

export function getWebAppInitData(): string {
  const initData = window?.Telegram?.WebApp?.initData
  if (initData && initData !== 'query_id') {
    localStorage?.setItem('tgWebAppData', initData);
    return initData;
  }
  return localStorage?.getItem('tgWebAppData') || '';
}