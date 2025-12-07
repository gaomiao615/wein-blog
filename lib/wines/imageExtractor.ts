// 从URL提取产品图片的工具函数
// 注意：由于CORS限制，实际项目中应该使用后端API来提取图片

/**
 * 尝试从网页URL中提取产品图片
 * 这是一个客户端实现，实际应该使用后端服务
 */
export async function extractImageFromUrl(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    // 由于浏览器CORS限制，无法直接访问外部网站
    // 这里返回一个占位符，实际应该通过后端API实现
    // 或者使用第三方服务如：
    // - Open Graph API
    // - 自定义后端API
    // - 图片代理服务
    
    // 对于已知的网站，可以尝试构建图片URL
    if (url.includes('moevenpick-wein.de')) {
      // Mövenpick Wein 网站的图片通常在这个路径
      // 这里返回一个通用的产品图片占位符
      return null; // 返回null，让组件使用默认占位符
    }

    return null;
  } catch (error) {
    console.error('Failed to extract image from URL:', error);
    return null;
  }
}

/**
 * 生成产品图片的占位符URL
 * 使用 wine name 生成一个占位符
 */
export function getWinePlaceholderImage(wineName: string): string {
  // 使用更好的占位图片服务
  // 使用 wine bottle emoji 和渐变背景
  const encodedName = encodeURIComponent(wineName.substring(0, 20));
  // 使用不同的颜色根据酒的类型
  const bgColor = '8B0000'; // 深红色背景
  const textColor = 'FFFFFF'; // 白色文字
  return `https://placehold.co/400x600/${bgColor}/${textColor}?text=🍷+${encodedName}`;
}

/**
 * 生成酒瓶SVG占位符（内联）- 改进版
 */
export function getWineBottleSVG(wineName: string, color: 'red' | 'white' | 'rose' = 'red'): string {
  // 根据颜色选择不同的渐变
  const gradients = {
    red: { start: '#8B0000', end: '#4B0000' },
    white: { start: '#F5DEB3', end: '#D2B48C' },
    rose: { start: '#FFB6C1', end: '#FF69B4' }
  };
  
  const grad = gradients[color];
  const shortName = wineName.substring(0, 25).replace(/[<>]/g, '');
  
  // 使用更简单的SVG，避免编码问题
  const svg = `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${grad.start};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${grad.end};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="600" fill="url(#grad)" rx="8"/>
    <text x="200" y="280" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">🍷</text>
    <text x="200" y="340" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">${shortName}</text>
  </svg>`;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 尝试从Unsplash获取葡萄酒图片（不需要API key的公开图片）
 */
export function getWineImageFromUnsplash(wineName: string, color: 'red' | 'white' | 'rose' = 'red'): string {
  // 使用Unsplash Source（不需要API key）
  const colorMap = {
    red: 'wine+bottle+red',
    white: 'wine+bottle+white',
    rose: 'wine+bottle+rose'
  };
  const searchTerm = colorMap[color];
  // 使用Unsplash Source的随机图片API
  return `https://source.unsplash.com/400x600/?${searchTerm}`;
}

