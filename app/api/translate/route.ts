import { NextRequest, NextResponse } from 'next/server';

/**
 * 翻译API
 * 使用免费的MyMemory Translation API进行翻译
 * 支持：德语(de) <-> 英语(en) <-> 中文(zh)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('text');
    const from = searchParams.get('from'); // 源语言: de, en, zh
    const to = searchParams.get('to'); // 目标语言: de, en, zh

    // 验证参数
    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: text, from, to' },
        { status: 400 }
      );
    }

    // 如果源语言和目标语言相同，直接返回
    if (from === to) {
      return NextResponse.json({ translatedText: text });
    }

    // MyMemory API的语言代码映射
    const languageMap: Record<string, string> = {
      'de': 'de',
      'en': 'en',
      'zh': 'zh-CN',
    };

    const fromLang = languageMap[from] || from;
    const toLang = languageMap[to] || to;

    // 调用MyMemory Translation API（免费，无需API密钥）
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WineBlog/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();

    // 检查响应格式
    if (data.responseStatus === 200 && data.responseData) {
      let translatedText = data.responseData.translatedText || '';
      
      // 清理翻译结果：去除HTML标签
      translatedText = translatedText.replace(/<[^>]*>/g, '');
      // 去除多余空格
      translatedText = translatedText.replace(/\s+/g, ' ').trim();
      
      return NextResponse.json({
        translatedText: translatedText,
        originalText: text,
        from: from,
        to: to,
      });
    } else {
      throw new Error('Invalid response from translation API');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please try again or enter manually.' },
      { status: 500 }
    );
  }
}

