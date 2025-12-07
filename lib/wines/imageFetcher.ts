/**
 * 从网页URL提取产品图片的工具
 * 由于CORS限制，这里提供多种策略
 */

/**
 * 尝试从Mövenpick Wein网站URL构建图片URL
 * 基于网站结构，图片通常在这些位置
 */
export function buildMoevenpickImageUrl(sourceUrl: string): string[] {
  if (!sourceUrl || !sourceUrl.includes('moevenpick-wein.de')) {
    return [];
  }

  try {
    // 从URL提取产品标识符
    const urlParts = sourceUrl.split('/');
    const productSlug = urlParts[urlParts.length - 1].replace('.html', '');
    
    // Mövenpick Wein的图片可能的路径（尝试多个）
    // 使用图片代理服务images.weserv.nl来绕过CORS限制
    const baseUrl = 'https://www.moevenpick-wein.de';
    const possiblePaths = [
      // 常见的Magento媒体路径
      `${baseUrl}/media/catalog/product/cache/1/image/600x600/${productSlug}.jpg`,
      `${baseUrl}/media/catalog/product/${productSlug}.jpg`,
      `${baseUrl}/media/catalog/product/cache/1/small_image/300x300/${productSlug}.jpg`,
      `${baseUrl}/media/catalog/product/cache/1/thumbnail/600x600/${productSlug}.jpg`,
      // 尝试不同的文件扩展名
      `${baseUrl}/media/catalog/product/cache/1/image/600x600/${productSlug}.png`,
      `${baseUrl}/media/catalog/product/${productSlug}.png`,
    ];
    
    // 使用图片代理服务包装所有URL
    const possibleUrls = possiblePaths.map(path => 
      `https://images.weserv.nl/?url=${encodeURIComponent(path)}&output=webp&w=400&h=600&fit=cover`
    );
    
    return possibleUrls;
  } catch (error) {
    console.error('Failed to build image URL:', error);
    return [];
  }
}

/**
 * 使用图片代理服务获取图片
 * 注意：这需要后端支持或使用第三方代理服务
 */
export async function fetchImageViaProxy(url: string): Promise<string | null> {
  // 由于CORS限制，这需要在后端实现
  // 或者使用第三方图片代理服务如：
  // - images.weserv.nl
  // - api.allorigins.win
  // - cors-anywhere (需要自己的服务器)
  
  try {
    // 使用images.weserv.nl作为图片代理（支持CORS）
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=webp`;
    return proxyUrl;
  } catch (error) {
    console.error('Failed to create proxy URL:', error);
    return null;
  }
}

/**
 * 尝试从网页URL提取Open Graph图片
 * 这需要后端API支持，或者使用第三方服务
 */
export async function extractOGImage(url: string): Promise<string | null> {
  // 实际实现需要后端API
  // 可以使用服务如：
  // - https://opengraph.io/
  // - 自定义后端API调用目标网站并解析HTML
  
  // 这里返回null，实际应该调用后端API
  return null;
}

/**
 * 综合策略：尝试多种方法获取图片
 */
export async function getWineImageFromSource(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl) return null;

  // 策略1: 如果是Mövenpick Wein，尝试构建图片URL
  if (sourceUrl.includes('moevenpick-wein.de')) {
    const possibleUrls = buildMoevenpickImageUrl(sourceUrl);
    // 返回第一个URL（使用代理服务）
    // 注意：实际图片路径可能需要根据网站结构调整
    if (possibleUrls.length > 0) {
      console.log('尝试加载图片URL:', possibleUrls[0]);
      return possibleUrls[0];
    }
  }

  // 策略2: 使用通用图片代理服务访问原网页
  // 尝试使用截图服务或Open Graph API（需要后端支持）
  
  return null;
}

/**
 * 直接从Mövenpick Wein产品页面提取图片
 * 使用图片代理服务访问常见的图片路径
 */
export function getMoevenpickProductImage(sourceUrl: string): string {
  if (!sourceUrl || !sourceUrl.includes('moevenpick-wein.de')) {
    return '';
  }

  try {
    // 提取产品slug
    const urlParts = sourceUrl.split('/');
    const productSlug = urlParts[urlParts.length - 1].replace('.html', '');
    
    // 尝试最常见的Magento媒体路径
    // 使用图片代理服务images.weserv.nl来绕过CORS
    const imagePath = `https://www.moevenpick-wein.de/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/${productSlug}.jpg`;
    const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imagePath)}&output=webp&w=400&h=600&fit=cover`;
    
    return proxiedUrl;
  } catch (error) {
    console.error('Failed to build Moevenpick image URL:', error);
    return '';
  }
}

/**
 * 使用网页截图服务获取产品图片
 * 使用第三方服务如htmlcsstoimage.com或类似服务
 */
export function getWineImageViaScreenshot(sourceUrl: string): string | null {
  if (!sourceUrl) return null;
  
  // 使用htmlcsstoimage.com的API（需要API key）
  // 或者使用其他截图服务
  // 这里返回null，实际需要配置API key
  return null;
}

/**
 * 验证图片URL是否可访问
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    // 设置超时
    setTimeout(() => resolve(false), 5000);
  });
}

