// 保存和获取葡萄酒的源URL（从URL搜索中获取）
const SOURCE_URLS_KEY = 'wein-blog-source-urls';

// 获取所有保存的源URL
export function getSourceUrls(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(SOURCE_URLS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// 保存源URL
export function saveSourceUrl(wineId: string, url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const urls = getSourceUrls();
    urls[wineId] = url;
    localStorage.setItem(SOURCE_URLS_KEY, JSON.stringify(urls));
  } catch {
    // 忽略错误
  }
}

// 获取单个酒的源URL
export function getSourceUrl(wineId: string): string | undefined {
  const urls = getSourceUrls();
  return urls[wineId];
}

