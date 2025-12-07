'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { searchWineByName, searchWineByCode } from '@/lib/wines/data';
import type { Wine } from '@/lib/wines/data';
import { createWorker } from 'tesseract.js';
import { saveSourceUrl } from '@/lib/wines/sourceUrls';

interface WineSearchAdvancedProps {
  onWineSelect?: (wine: Wine) => void;
}

export function WineSearchAdvanced({ onWineSelect }: WineSearchAdvancedProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Wine[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 文本搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchWineByName(searchQuery, locale as 'en' | 'de' | 'zh');
    setSearchResults(results);
  };

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 分析图片
    setIsAnalyzing(true);
    setImageAnalysis(t('search.analyzing'));

    try {
      // 使用 Tesseract.js 进行 OCR 识别
      const worker = await createWorker('eng+deu', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setImageAnalysis(`${t('search.analyzing')} ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      // 识别图片中的文字
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      console.log('OCR识别结果:', text);

      // 从识别结果中搜索葡萄酒
      const recognizedText = text.toLowerCase();
      let foundWine: Wine | undefined;

      // 搜索关键词列表
      const searchTerms = [
        'riesling', '雷司令', 'spatburgunder', 'spätburgunder', 'pinot', '黑皮诺',
        'gewurz', 'gewürztraminer', '琼瑶浆', 'dornfelder', '丹菲特', 
        'sekt', '起泡酒', 'trocken', '干型', 'süß', '甜型'
      ];

      // 尝试匹配识别到的文字
      for (const term of searchTerms) {
        if (recognizedText.includes(term.toLowerCase())) {
          const results = searchWineByName(term, locale as 'en' | 'de' | 'zh');
          if (results.length > 0) {
            foundWine = results[0];
            break;
          }
        }
      }

      // 如果直接搜索识别到的文字
      if (!foundWine && recognizedText.trim().length > 2) {
        const words = recognizedText.split(/\s+/).filter(w => w.length > 3);
        for (const word of words) {
          const results = searchWineByName(word, locale as 'en' | 'de' | 'zh');
          if (results.length > 0) {
            foundWine = results[0];
            break;
          }
        }
      }

      if (foundWine) {
        setImageAnalysis(`${t('search.imageRecognized')}: ${foundWine.name}`);
        setTimeout(() => {
          if (onWineSelect) {
            onWineSelect(foundWine!);
          } else {
            router.push(`/wines/${foundWine!.id}`);
          }
        }, 500);
      } else {
        setImageAnalysis(t('search.imageNotRecognized') + ` (识别到: ${text.substring(0, 50)}...)`);
      }
      setIsAnalyzing(false);
    } catch (err) {
      console.error('OCR error:', err);
      // 如果 OCR 失败，尝试使用文件名匹配作为后备方案
      const fileName = file.name.toLowerCase();
      let foundWine: Wine | undefined;

      const searchTerms = [
        'riesling', '雷司令', 'spatburgunder', 'pinot', '黑皮诺',
        'gewurz', '琼瑶浆', 'dornfelder', '丹菲特', 'sekt', '起泡酒'
      ];

      for (const term of searchTerms) {
        if (fileName.includes(term)) {
          const results = searchWineByName(term, locale as 'en' | 'de' | 'zh');
          if (results.length > 0) {
            foundWine = results[0];
            break;
          }
        }
      }

      if (foundWine) {
        setImageAnalysis(`${t('search.imageRecognized')}: ${foundWine.name}`);
        setTimeout(() => {
          if (onWineSelect) {
            onWineSelect(foundWine!);
          } else {
            router.push(`/wines/${foundWine!.id}`);
          }
        }, 500);
      } else {
        setImageAnalysis(t('search.imageNotRecognized'));
      }
      setIsAnalyzing(false);
    }
  };

  // 处理 URL 输入
  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setImageAnalysis(t('search.analyzing'));

    try {
      // 确保URL格式正确
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // 从 URL 中提取所有可能的搜索词
      const urlLower = normalizedUrl.toLowerCase();
      let foundWine: Wine | undefined;

      // 提取 URL 路径部分（去掉域名和协议）
      const urlObj = new URL(normalizedUrl);
      const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
      const allText = [...pathParts, urlObj.hostname].join(' ').toLowerCase();

      console.log('URL分析 - 路径部分:', pathParts);
      console.log('URL分析 - 所有文本:', allText);

      // 首先尝试完整酒名匹配（优先级最高）
      const { wines: allWines } = await import('@/lib/wines/data');
      
      // 提取URL中的文件名（去掉.html等扩展名）
      const urlFileName = pathParts[pathParts.length - 1]?.replace(/\.(html|htm|php|aspx?)$/i, '') || '';
      const urlFileNameLower = urlFileName.toLowerCase();
      
      console.log('URL分析 - 文件名:', urlFileNameLower);
      
      // 定义需要精确匹配的完整酒名（避免误匹配）
      // 注意：URL中可能使用连字符，所以需要处理多种格式
      const exactWineNames = [
        { patterns: ['miraval-rose', 'miraval-rosé', 'miraval rose', 'miraval rosé', 'miravalrose'], wineId: '20' },
        { patterns: ['pesquera-crianza', 'pesquera crianza', 'pesqueracrianza'], wineId: '8' },
        { patterns: ['prosecco'], wineId: '12' },
        { patterns: ['roero-arneis', 'roero arneis', 'roeroarneis', 'roero', 'arneis'], wineId: '21' },
        { patterns: ['meursault'], wineId: '22' },
      ];
      
      // 首先尝试精确匹配完整酒名
      for (const exactName of exactWineNames) {
        for (const pattern of exactName.patterns) {
          if (urlFileNameLower.includes(pattern)) {
            foundWine = allWines.find(w => w.id === exactName.wineId);
            if (foundWine) {
              console.log('URL精确匹配成功:', pattern, '->', foundWine.name);
              break;
            }
          }
        }
        if (foundWine) break;
      }
      
      // 如果精确匹配失败，尝试匹配所有酒的完整名称
      if (!foundWine) {
        for (const wine of allWines) {
          const wineNameLower = wine.name.toLowerCase();
          const wineNameDeLower = wine.nameDe?.toLowerCase() || '';
          const wineNameZhLower = wine.nameZh?.toLowerCase() || '';
          
          // 将酒名转换为URL格式（替换空格为连字符）
          const wineNameUrlFormat = wineNameLower.replace(/\s+/g, '-');
          const wineNameDeUrlFormat = wineNameDeLower.replace(/\s+/g, '-');
          
          // 检查URL中是否包含完整的酒名（支持空格和连字符格式）
          if (wineNameLower.length >= 3 && 
              (urlFileNameLower.includes(wineNameLower) || 
               urlFileNameLower.includes(wineNameUrlFormat))) {
            foundWine = wine;
            console.log('URL完整酒名匹配成功:', wine.name);
            break;
          }
          if (wineNameDeLower.length >= 3 && 
              (urlFileNameLower.includes(wineNameDeLower) || 
               urlFileNameLower.includes(wineNameDeUrlFormat))) {
            foundWine = wine;
            console.log('URL完整酒名匹配成功(DE):', wine.name);
            break;
          }
          if (wineNameZhLower.length >= 3 && urlFileNameLower.includes(wineNameZhLower)) {
            foundWine = wine;
            console.log('URL完整酒名匹配成功(ZH):', wine.name);
            break;
          }
          
          // 对于多词酒名，检查是否所有关键词都在URL中
          const wineNameWords = wineNameLower.split(/\s+/).filter(w => w.length > 2);
          if (wineNameWords.length > 1) {
            const allWordsFound = wineNameWords.every(word => urlFileNameLower.includes(word));
            if (allWordsFound) {
              foundWine = wine;
              console.log('URL多词匹配成功:', wine.name, '关键词:', wineNameWords);
              break;
            }
          }
        }
      }

      // 扩展的搜索关键词列表（包括变体和别名）- 作为备选方案
      interface SearchTerm {
        terms: string[];
        match: string;
        priority: number;
      }
      
      const searchTerms: SearchTerm[] = [
        // 完整酒名（优先级高）- 注意：这些已经在上面精确匹配中处理了
        { terms: ['miraval rose', 'miraval rosé', 'miraval'], match: 'miraval rosé', priority: 1 },
        { terms: ['pesquera crianza', 'pesquera'], match: 'pesquera crianza', priority: 1 },
        { terms: ['prosecco'], match: 'prosecco', priority: 1 },
        { terms: ['roero arneis', 'roero-arneis', 'roero', 'arneis'], match: 'roero arneis', priority: 1 },
        { terms: ['meursault'], match: 'meursault', priority: 1 },
        // 葡萄品种
        { terms: ['riesling', '雷司令'], match: 'riesling', priority: 2 },
        { terms: ['spatburgunder', 'spätburgunder', 'pinot noir', 'pinot', '黑皮诺'], match: 'spatburgunder', priority: 2 },
        { terms: ['gewurz', 'gewürztraminer', '琼瑶浆'], match: 'gewürztraminer', priority: 2 },
        { terms: ['dornfelder', '丹菲特'], match: 'dornfelder', priority: 2 },
        { terms: ['sekt', '起泡酒', 'sparkling'], match: 'sekt', priority: 2 },
        { terms: ['tempranillo', '丹魄'], match: 'tempranillo', priority: 2 },
        { terms: ['garnacha', '歌海娜'], match: 'garnacha', priority: 2 },
        { terms: ['sangiovese', '桑娇维塞'], match: 'sangiovese', priority: 2 },
        { terms: ['chardonnay', '霞多丽'], match: 'chardonnay', priority: 2 },
        { terms: ['cabernet', '赤霞珠'], match: 'cabernet', priority: 2 },
        { terms: ['merlot', '梅洛'], match: 'merlot', priority: 2 },
        { terms: ['glera', '格雷拉'], match: 'glera', priority: 2 },
        { terms: ['silvaner', '西万尼'], match: 'silvaner', priority: 2 },
        { terms: ['muller', 'müller', 'thurgau', '米勒', '图高'], match: 'müller-thurgau', priority: 2 },
        // 地区（优先级较低）
        { terms: ['mosel'], match: 'mosel', priority: 3 },
        { terms: ['baden'], match: 'baden', priority: 3 },
        { terms: ['pfalz'], match: 'pfalz', priority: 3 },
        { terms: ['rheingau'], match: 'rheingau', priority: 3 },
        { terms: ['ribera', 'duero', '杜埃罗'], match: 'ribera del duero', priority: 3 },
        { terms: ['rioja', '里奥哈'], match: 'rioja', priority: 3 },
        { terms: ['champagne', '香槟'], match: 'champagne', priority: 3 },
        { terms: ['bordeaux', '波尔多'], match: 'bordeaux', priority: 3 },
        { terms: ['burgundy', 'burgund', '勃艮第'], match: 'burgundy', priority: 3 },
        { terms: ['chianti', '基安蒂'], match: 'chianti', priority: 3 },
        { terms: ['tuscany', 'toskana', '托斯卡纳'], match: 'tuscany', priority: 3 },
        { terms: ['veneto', '威尼托'], match: 'veneto', priority: 3 },
        { terms: ['franken', '弗兰肯'], match: 'franken', priority: 3 },
        { terms: ['rheinhessen', '莱茵黑森'], match: 'rheinhessen', priority: 3 },
        { terms: ['provence', '普罗旺斯'], match: 'provence', priority: 3 },
        // 类型（优先级最低）
        { terms: ['trocken', 'dry', '干型'], match: 'trocken', priority: 4 },
        { terms: ['süß', 'sweet', '甜型'], match: 'sweet', priority: 4 },
        { terms: ['crianza', '陈酿'], match: 'crianza', priority: 4 },
        { terms: ['reserva', '珍藏'], match: 'reserva', priority: 4 },
        { terms: ['brut', '干型起泡'], match: 'brut', priority: 4 },
      ];

      // 如果完整酒名匹配失败，尝试关键词匹配（按优先级排序）
      if (!foundWine) {
        // 按优先级排序
        const sortedTerms = searchTerms.sort((a, b) => (a.priority || 99) - (b.priority || 99));
        
        for (const { terms, match } of sortedTerms) {
          for (const term of terms) {
            if (allText.includes(term)) {
              const results = searchWineByName(match, locale as 'en' | 'de' | 'zh');
              if (results.length > 0) {
                foundWine = results[0];
                console.log('URL关键词匹配成功:', term, '->', foundWine.name);
                break;
              }
            }
          }
          if (foundWine) break;
        }
      }

      // 如果还没找到，尝试从路径中提取单词并搜索（最后备选方案）
      if (!foundWine) {
        const words = allText.split(/[\s\-_\.\/]+/).filter(w => w.length > 3);
        console.log('URL分析 - 提取的单词:', words);
        
        for (const word of words) {
          // 跳过常见非关键词
          const skipWords = ['www', 'http', 'https', 'com', 'de', 'en', 'wine', 'wein', '2022', '2023', '2024', 'aop', 'aoc', 'docg', 'familles', 'pitt', 'perrin', 'cotes', 'les', 'vignes', 'html', 'htm', 'php', 'aspx'];
          if (skipWords.includes(word)) {
            continue;
          }
          
          const results = searchWineByName(word, locale as 'en' | 'de' | 'zh');
          if (results.length > 0) {
            foundWine = results[0];
            console.log('URL单词匹配成功:', word, '->', foundWine.name);
            break;
          }
        }
      }

      // 如果还没找到，使用智能评分系统进行多维度匹配
      if (!foundWine) {
        const searchWords = allText.split(/[\s\-_\.\/]+/).filter(w => w.length > 3);
        const filteredWords = searchWords.filter(word => 
          !['www', 'http', 'https', 'com', 'de', 'en', 'wine', 'wein', '2022', '2023', '2024', 'aop', 'aoc', 'docg', 'familles', 'pitt', 'perrin', 'cotes', 'les', 'vignes', 'html'].includes(word)
        );
        
        console.log('URL分析 - 过滤后的关键词:', filteredWords);
        
        // 为每个酒计算匹配分数
        const wineScores: Array<{ wine: Wine; score: number; matches: string[] }> = [];
        
        for (const wine of allWines) {
          let score = 0;
          const matches: string[] = [];
          
          const wineNameLower = wine.name.toLowerCase();
          const wineNameDeLower = wine.nameDe?.toLowerCase() || '';
          const wineNameZhLower = wine.nameZh?.toLowerCase() || '';
          const regionLower = wine.region.toLowerCase();
          const regionDeLower = wine.regionDe?.toLowerCase() || '';
          const regionZhLower = wine.regionZh?.toLowerCase() || '';
          const countryLower = wine.country.toLowerCase();
          const countryDeLower = wine.countryDe?.toLowerCase() || '';
          const grapesLower = wine.grapes.map(g => g.toLowerCase());
          const grapesDeLower = wine.grapesDe?.map(g => g.toLowerCase()) || [];
          
          for (const word of filteredWords) {
            // 酒名完全匹配（最高分）
            if (wineNameLower.includes(word) || wineNameDeLower.includes(word) || wineNameZhLower.includes(word)) {
              score += 10;
              matches.push(`酒名:${word}`);
            }
            // 地区匹配（高分）
            else if (regionLower.includes(word) || regionDeLower.includes(word) || regionZhLower.includes(word)) {
              score += 8;
              matches.push(`地区:${word}`);
            }
            // 葡萄品种匹配（高分）
            else if (grapesLower.some(g => g.includes(word)) || grapesDeLower.some(g => g.includes(word))) {
              score += 8;
              matches.push(`葡萄:${word}`);
            }
            // 国家匹配（中分）
            else if (countryLower.includes(word) || countryDeLower.includes(word)) {
              score += 5;
              matches.push(`国家:${word}`);
            }
            // 部分匹配（低分）
            else if (wineNameLower.includes(word.substring(0, 4)) || 
                     regionLower.includes(word.substring(0, 4))) {
              score += 2;
              matches.push(`部分:${word}`);
            }
          }
          
          if (score > 0) {
            wineScores.push({ wine, score, matches });
          }
        }
        
        // 按分数排序，选择得分最高的酒
        if (wineScores.length > 0) {
          wineScores.sort((a, b) => b.score - a.score);
          foundWine = wineScores[0].wine;
          console.log('URL智能匹配成功:', foundWine.name, '得分:', wineScores[0].score, '匹配:', wineScores[0].matches);
        }
      }

      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (foundWine) {
        // 保存源URL（使用规范化后的URL）
        saveSourceUrl(foundWine.id, normalizedUrl);
        setImageAnalysis(`${t('search.urlAnalyzed')}: ${foundWine.name}`);
        setTimeout(() => {
          if (onWineSelect) {
            onWineSelect(foundWine!);
          } else {
            router.push(`/wines/${foundWine!.id}`);
          }
        }, 500);
      } else {
        // 提供更详细的反馈
        const extractedTerms = allText.split(/[\s\-_\.\/]+/).filter(w => w.length > 3 && !['www', 'http', 'https', 'com', 'de'].includes(w));
        setImageAnalysis(
          t('search.urlNotRecognized') + 
          (extractedTerms.length > 0 ? ` (检测到: ${extractedTerms.slice(0, 3).join(', ')}...)` : '')
        );
      }
      setIsAnalyzing(false);
    } catch (err) {
      console.error('URL analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error details:', errorMessage);
      
      // 如果 URL 解析失败，尝试直接搜索整个 URL 字符串
      try {
        const urlLower = url.toLowerCase();
        const results = searchWineByName(urlLower, locale as 'en' | 'de' | 'zh');
        if (results.length > 0) {
          setImageAnalysis(`${t('search.urlAnalyzed')}: ${results[0].name}`);
          setTimeout(() => {
            if (onWineSelect) {
              onWineSelect(results[0]);
            } else {
              router.push(`/wines/${results[0].id}`);
            }
          }, 500);
        } else {
          setImageAnalysis(t('search.urlNotRecognized') + ` (${errorMessage})`);
        }
      } catch (e) {
        const fallbackError = e instanceof Error ? e.message : String(e);
        setImageAnalysis(t('search.urlNotRecognized') + ` (${fallbackError})`);
      }
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('search.title')}</h2>
        
        {/* 文本搜索 */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('search.placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {t('search.search')}
            </button>
          </div>
        </div>

        {/* 图片上传 */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('search.uploadImage')}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            {t('search.selectImage')}
          </button>
          {uploadedImage && (
            <div className="mt-4">
              <img src={uploadedImage} alt="Uploaded" className="max-w-full h-48 object-contain rounded-lg border" />
              {isAnalyzing && (
                <p className="mt-2 text-sm text-gray-600">{imageAnalysis}</p>
              )}
            </div>
          )}
        </div>

        {/* URL 输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('search.enterUrl')}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/wine/..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit((e.target as HTMLInputElement).value);
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input) handleUrlSubmit(input.value);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              {t('search.analyzeUrl')}
            </button>
          </div>
          {imageAnalysis && !uploadedImage && (
            <p className="mt-2 text-sm text-gray-600">{imageAnalysis}</p>
          )}
        </div>

        {/* 搜索结果 */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
            </h3>
            <div className="space-y-4">
              {searchResults.map((wine) => (
                <div
                  key={wine.id}
                  onClick={() => {
                    if (onWineSelect) {
                      onWineSelect(wine);
                    } else {
                      router.push(`/wines/${wine.id}`);
                    }
                  }}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h4 className="font-semibold text-lg mb-2">
                    {locale === 'de' && wine.nameDe ? wine.nameDe :
                     locale === 'zh' && wine.nameZh ? wine.nameZh :
                     wine.name}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {locale === 'de' && wine.countryDe ? wine.countryDe :
                       locale === 'zh' && wine.countryZh ? wine.countryZh :
                       wine.country} · {' '}
                      {locale === 'de' && wine.regionDe ? wine.regionDe :
                       locale === 'zh' && wine.regionZh ? wine.regionZh :
                       wine.region}
                    </p>
                    <p>
                      {locale === 'de' && wine.grapesDe ? wine.grapesDe.join(', ') :
                       locale === 'zh' && wine.grapesZh ? wine.grapesZh.join(', ') :
                       wine.grapes.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

