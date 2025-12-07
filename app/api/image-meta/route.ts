import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// 白名单域名配置（与image-proxy保持一致）
const ALLOWED_DOMAINS = [
  'moevenpick-wein.de',
  'unsplash.com',
  'images.unsplash.com',
  'source.unsplash.com',
  'example.com',
  'via.placeholder.com',
  'placehold.co',
  'images.weserv.nl',
];

/**
 * 验证URL是否在白名单中
 */
function isUrlAllowed(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * 图片元数据API
 * 获取图片的宽度、高度、格式、大小等信息
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
    });

    // 检查响应状态
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: 502 }
      );
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // 使用sharp分析图片元数据
    const metadata = await sharp(buffer).metadata();

    // 返回元数据
    return NextResponse.json({
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length, // 字节大小
      hasAlpha: metadata.hasAlpha || false,
      channels: metadata.channels || 0,
      density: metadata.density || 0,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      },
    });
  } catch (error) {
    console.error('Image meta error:', error);
    
    // 如果是sharp相关的错误，返回更具体的错误信息
    if (error instanceof Error) {
      if (error.message.includes('Input buffer contains unsupported image format')) {
        return NextResponse.json(
          { error: 'Unsupported image format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 502 }
    );
  }
}

