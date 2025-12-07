import { NextRequest, NextResponse } from 'next/server';

// 白名单域名配置
// 只允许这些域名的图片请求，提高安全性
const ALLOWED_DOMAINS = [
  'moevenpick-wein.de',
  'unsplash.com',
  'images.unsplash.com',
  'source.unsplash.com',
  'example.com',
  'via.placeholder.com',
  'placehold.co',
  'images.weserv.nl',
  // 可以在这里添加更多允许的域名
];

/**
 * 验证URL是否在白名单中
 */
function isUrlAllowed(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // 检查是否在白名单中
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * 图片代理API
 * 通过后端转发外部图片，解决CORS问题
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    // 验证URL参数
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // 验证URL格式
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // 验证域名白名单
    // 注意：如果需要访问所有域名，可以注释掉这个检查
    if (!isUrlAllowed(imageUrl)) {
      return NextResponse.json(
        { error: 'Domain not allowed. Please add it to ALLOWED_DOMAINS in route.ts' },
        { status: 403 }
      );
    }

    // 只允许http和https协议
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Only http and https protocols are allowed' },
        { status: 400 }
      );
    }

    // 使用fetch获取图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WineBlog/1.0)',
      },
      // 设置超时（Next.js默认超时时间）
    });

    // 检查响应状态
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: 502 }
      );
    }

    // 检查Content-Type是否为图片
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL does not point to an image' },
        { status: 400 }
      );
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();

    // 返回图片，保留原始Content-Type
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 缓存1年
        'Access-Control-Allow-Origin': '*', // 允许跨域访问
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 502 }
    );
  }
}

