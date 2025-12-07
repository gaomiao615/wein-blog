'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { CustomVocabulary } from '@/lib/learning/customVocabulary';

interface AddVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vocab: Omit<CustomVocabulary, 'id'>) => void;
}

export function AddVocabularyModal({ isOpen, onClose, onSave }: AddVocabularyModalProps) {
  const { locale } = useI18n();
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    meaningZh: '',
    example: '',
    exampleEn: '',
    exampleZh: '',
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastEditedField, setLastEditedField] = useState<string | null>(null);
  const [exampleOptions, setExampleOptions] = useState<Array<{ de: string; en: string; zh: string }>>([]);
  const [showExampleOptions, setShowExampleOptions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 清理文本：去除HTML标签、多余空格等
  const cleanText = (text: string): string => {
    if (!text) return '';
    // 去除HTML标签
    let cleaned = text.replace(/<[^>]*>/g, '');
    // 去除多余空格
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    // 去除特殊字符（保留字母、数字、中文、标点）
    cleaned = cleaned.replace(/[^\w\s\u4e00-\u9fa5.,!?;:()\-]/g, '');
    return cleaned;
  };

  // 翻译函数
  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    if (!text.trim()) return '';
    
    try {
      const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Translation API error:', data.error);
        return '';
      }
      
      const translated = data.translatedText || '';
      // 清理翻译结果
      const cleaned = cleanText(translated);
      
      // 验证翻译结果是否有效（不能太短，不能包含HTML标签）
      if (cleaned.length < 1 || cleaned.includes('<') || cleaned.includes('>')) {
        console.warn('Invalid translation result:', translated);
        return '';
      }
      
      return cleaned;
    } catch (error) {
      console.error('Translation error:', error);
      return '';
    }
  };

  // 从API获取智能生成的例句（多个选项）
  const fetchSmartExamples = async (
    deWord: string,
    enWord: string,
    zhWord: string,
    count: number = 3
  ): Promise<Array<{ de: string; en: string; zh: string }> | null> => {
    try {
      const response = await fetch('/api/generate-examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: deWord,
          enWord: enWord,
          zhWord: zhWord,
          count: count,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // API可能返回数组或单个对象
        if (Array.isArray(data.examples)) {
          return data.examples;
        } else if (data.examples && typeof data.examples === 'object') {
          return [data.examples];
        }
      }
    } catch (error) {
      console.error('Failed to fetch smart examples:', error);
    }
    return null;
  };

  // 智能生成例句 - 根据词性和语境生成多种不同的例句（作为fallback）
  // 确保生成的例句包含输入的单词，且逻辑合理
  const generateExamples = async (
    deWord: string,
    enWord: string,
    zhWord: string,
    count: number = 1
  ): Promise<Array<{ de: string; en: string; zh: string }>> => {
    // 首先尝试从API获取智能例句（多个选项）
    const smartExamples = await fetchSmartExamples(deWord, enWord, zhWord, count);
    if (smartExamples && smartExamples.length > 0) {
      return smartExamples;
    }
    
    // 如果API失败，使用本地模板生成多个变体
    const localExamples = [];
    for (let i = 0; i < count; i++) {
      localExamples.push(generateExamplesLocal(deWord, enWord, zhWord, i));
    }
    return localExamples;
  };

  // 本地模板生成（fallback方法）
  const generateExamplesLocal = (deWord: string, enWord: string, zhWord: string): { de: string; en: string; zh: string } => {
    // 清理单词（去除HTML标签、多余空格等）
    const cleanDeWord = cleanText(deWord);
    const cleanEnWord = cleanText(enWord);
    const cleanZhWord = cleanText(zhWord);
    
    // 如果清理后为空，使用原始值
    const finalDeWord = cleanDeWord || deWord.trim();
    const finalEnWord = cleanEnWord || enWord.trim();
    const finalZhWord = cleanZhWord || zhWord.trim();
    
    // 避免重复：如果单词本身就是"Wein"，避免在例句中再次使用"Wein"
    const wordLower = finalDeWord.toLowerCase();
    const isWineWord = wordLower === 'wein' || wordLower === 'wine' || wordLower === '葡萄酒';
    
    // 检测词性（改进的启发式方法）
    const isAdjective = finalDeWord.endsWith('isch') || finalDeWord.endsWith('lich') || finalDeWord.endsWith('ig') || 
                        finalDeWord.endsWith('bar') || finalDeWord.endsWith('sam') || finalDeWord.endsWith('los') ||
                        finalDeWord.endsWith('end') || finalDeWord.endsWith('ant');
    // 名词检测：首字母大写，且不是动词形式
    const isNoun = finalDeWord[0] === finalDeWord[0].toUpperCase() && 
                   !finalDeWord.includes(' ') && 
                   !finalDeWord.endsWith('en') && 
                   !finalDeWord.endsWith('n');
    // 动词检测：以-en或-n结尾，且首字母小写
    const isVerb = (finalDeWord.endsWith('en') || finalDeWord.endsWith('n')) && 
                   finalDeWord[0] === finalDeWord[0].toLowerCase();
    const isPhrase = finalDeWord.includes(' ') || finalDeWord.length > 15;
    
    // 葡萄酒相关名词列表（可以"喝"的名词）
    const drinkableNouns = ['wein', 'rotwein', 'weißwein', 'rosé', 'champagner', 'sekt', 'sherry', 'portwein', 'likör'];
    const isDrinkableNoun = drinkableNouns.some(noun => finalDeWord.toLowerCase().includes(noun));
    
    // 地区/产地相关词汇
    const regionWords = ['region', 'gebiet', 'tal', 'berg', 'mosel', 'rhein', 'baden', 'franken', 'pfalz'];
    const isRegion = regionWords.some(word => finalDeWord.toLowerCase().includes(word));
    
    // 葡萄品种相关词汇
    const grapeWords = ['riesling', 'spätburgunder', 'gewürztraminer', 'müller', 'dornfelder', 'silvaner'];
    const isGrape = grapeWords.some(word => finalDeWord.toLowerCase().includes(word));

    // 多种例句模板
    const templates = [];

    if (isPhrase) {
      // 短语/词组的例句模板
      templates.push(
        {
          de: `Wir genießen ${finalDeWord}.`,
          en: `We enjoy ${finalEnWord}.`,
          zh: `我们享受${finalZhWord}。`
        },
        {
          de: `Dieser Wein passt zu ${finalDeWord}.`,
          en: `This wine goes well with ${finalEnWord}.`,
          zh: `这款酒很适合${finalZhWord}。`
        },
        {
          de: `Ich denke an ${finalDeWord}.`,
          en: `I think of ${finalEnWord}.`,
          zh: `我想到了${finalZhWord}。`
        },
        {
          de: `Wir feiern ${finalDeWord} mit diesem Wein.`,
          en: `We celebrate ${finalEnWord} with this wine.`,
          zh: `我们用这酒庆祝${finalZhWord}。`
        }
      );
    } else if (isAdjective) {
      // 形容词的例句模板 - festlich 是形容词
      templates.push(
        {
          de: `Dieser Wein schmeckt ${finalDeWord}.`,
          en: `This wine tastes ${finalEnWord}.`,
          zh: `这酒尝起来${finalZhWord}。`
        },
        {
          de: `Ein ${finalDeWord}er Geschmack.`,
          en: `A ${finalEnWord} taste.`,
          zh: `一种${finalZhWord}的味道。`
        },
        {
          de: `Der Wein ist sehr ${finalDeWord}.`,
          en: `The wine is very ${finalEnWord}.`,
          zh: `这酒非常${finalZhWord}。`
        },
        {
          de: `Ich finde diesen Wein ${finalDeWord}.`,
          en: `I find this wine ${finalEnWord}.`,
          zh: `我觉得这酒${finalZhWord}。`
        },
        {
          de: `Wir trinken diesen ${finalDeWord}en Wein.`,
          en: `We drink this ${finalEnWord} wine.`,
          zh: `我们喝这${finalZhWord}的酒。`
        }
      );
    } else if (isNoun) {
      // 名词的例句模板 - 根据不同类型选择不同模板
      if (isWineWord) {
        // 如果单词本身就是"Wein"，使用不重复的模板
        templates.push(
          {
            de: `Ich trinke gerne ${finalDeWord} zum Abendessen.`,
            en: `I like to drink ${finalEnWord} with dinner.`,
            zh: `我喜欢在晚餐时喝${finalZhWord}。`
          },
          {
            de: `${finalDeWord} passt gut zu Käse.`,
            en: `${finalEnWord} pairs well with cheese.`,
            zh: `${finalZhWord}配奶酪很好。`
          },
          {
            de: `Ein Glas ${finalDeWord} zum Feiern.`,
            en: `A glass of ${finalEnWord} to celebrate.`,
            zh: `一杯${finalZhWord}来庆祝。`
          },
          {
            de: `Der Geschmack dieses ${finalDeWord}s ist einzigartig.`,
            en: `The taste of this ${finalEnWord} is unique.`,
            zh: `这${finalZhWord}的味道很独特。`
          }
        );
      } else if (isDrinkableNoun) {
        // 可饮用的名词（如葡萄酒类型）
        templates.push(
          {
            de: `Dieser ${finalDeWord} ist ausgezeichnet.`,
            en: `This ${finalEnWord} is excellent.`,
            zh: `这个${finalZhWord}很棒。`
          },
          {
            de: `Ich trinke gerne ${finalDeWord} zum Essen.`,
            en: `I like to drink ${finalEnWord} with food.`,
            zh: `我喜欢在用餐时喝${finalZhWord}。`
          },
          {
            de: `Der ${finalDeWord} hat ein besonderes Aroma.`,
            en: `The ${finalEnWord} has a special aroma.`,
            zh: `这个${finalZhWord}有特殊的香气。`
          },
          {
            de: `Wir probieren heute einen neuen ${finalDeWord}.`,
            en: `We're trying a new ${finalEnWord} today.`,
            zh: `我们今天尝试一种新的${finalZhWord}。`
          }
        );
      } else if (isRegion) {
        // 地区/产地名词
        templates.push(
          {
            de: `Dieser Wein kommt aus ${finalDeWord}.`,
            en: `This wine comes from ${finalEnWord}.`,
            zh: `这酒来自${finalZhWord}。`
          },
          {
            de: `Die Weine aus ${finalDeWord} sind berühmt.`,
            en: `Wines from ${finalEnWord} are famous.`,
            zh: `来自${finalZhWord}的酒很有名。`
          },
          {
            de: `Ich mag die Weine aus ${finalDeWord}.`,
            en: `I like wines from ${finalEnWord}.`,
            zh: `我喜欢来自${finalZhWord}的酒。`
          },
          {
            de: `${finalDeWord} ist eine bekannte Weinregion.`,
            en: `${finalEnWord} is a famous wine region.`,
            zh: `${finalZhWord}是著名的葡萄酒产区。`
          }
        );
      } else if (isGrape) {
        // 葡萄品种名词
        templates.push(
          {
            de: `${finalDeWord} ist eine beliebte Rebsorte.`,
            en: `${finalEnWord} is a popular grape variety.`,
            zh: `${finalZhWord}是一种受欢迎的葡萄品种。`
          },
          {
            de: `Weine aus ${finalDeWord} schmecken fruchtig.`,
            en: `Wines made from ${finalEnWord} taste fruity.`,
            zh: `用${finalZhWord}酿的酒尝起来有果味。`
          },
          {
            de: `Ich mag Weine aus ${finalDeWord}.`,
            en: `I like wines made from ${finalEnWord}.`,
            zh: `我喜欢用${finalZhWord}酿的酒。`
          },
          {
            de: `${finalDeWord} wächst gut in Deutschland.`,
            en: `${finalEnWord} grows well in Germany.`,
            zh: `${finalZhWord}在德国生长得很好。`
          }
        );
      } else {
        // 其他名词（使用更安全的通用模板）
        templates.push(
          {
            de: `Dieser Wein hat Noten von ${finalDeWord}.`,
            en: `This wine has notes of ${finalEnWord}.`,
            zh: `这酒有${finalZhWord}的味道。`
          },
          {
            de: `Der Wein passt gut zu ${finalDeWord}.`,
            en: `The wine pairs well with ${finalEnWord}.`,
            zh: `这酒配${finalZhWord}很好。`
          },
          {
            de: `Ich schmecke ${finalDeWord} in diesem Wein.`,
            en: `I taste ${finalEnWord} in this wine.`,
            zh: `我在这酒中尝到了${finalZhWord}。`
          },
          {
            de: `Der Wein erinnert mich an ${finalDeWord}.`,
            en: `The wine reminds me of ${finalEnWord}.`,
            zh: `这酒让我想起了${finalZhWord}。`
          }
        );
      }
    } else if (isVerb) {
      // 动词的例句模板
      templates.push(
        {
          de: `Ich ${finalDeWord} diesen Wein gerne.`,
          en: `I like to ${finalEnWord} this wine.`,
          zh: `我喜欢${finalZhWord}这酒。`
        },
        {
          de: `Wir ${finalDeWord} den Wein zusammen.`,
          en: `We ${finalEnWord} the wine together.`,
          zh: `我们一起${finalZhWord}这酒。`
        },
        {
          de: `Kannst du mir zeigen, wie man ${finalDeWord}?`,
          en: `Can you show me how to ${finalEnWord}?`,
          zh: `你能教我如何${finalZhWord}吗？`
        }
      );
    } else {
      // 默认模板（不确定词性时）- 使用更安全的通用模板，避免重复
      if (isWineWord) {
        // 如果单词是"Wein"，使用不重复的模板
        templates.push(
          {
            de: `Ich genieße ${finalDeWord} zum Abendessen.`,
            en: `I enjoy ${finalEnWord} with dinner.`,
            zh: `我喜欢在晚餐时享受${finalZhWord}。`
          },
          {
            de: `${finalDeWord} passt gut zu verschiedenen Gerichten.`,
            en: `${finalEnWord} pairs well with various dishes.`,
            zh: `${finalZhWord}配各种菜肴都很好。`
          },
          {
            de: `Ein Glas ${finalDeWord} macht den Abend perfekt.`,
            en: `A glass of ${finalEnWord} makes the evening perfect.`,
            zh: `一杯${finalZhWord}让夜晚更完美。`
          }
        );
      } else {
        templates.push(
          {
            de: `Dieser Wein hat Noten von ${finalDeWord}.`,
            en: `This wine has notes of ${finalEnWord}.`,
            zh: `这酒有${finalZhWord}的味道。`
          },
          {
            de: `Der Wein passt gut zu ${finalDeWord}.`,
            en: `The wine pairs well with ${finalEnWord}.`,
            zh: `这酒配${finalZhWord}很好。`
          },
          {
            de: `Ich schmecke ${finalDeWord} in diesem Wein.`,
            en: `I taste ${finalEnWord} in this wine.`,
            zh: `我在这酒中尝到了${finalZhWord}。`
          },
          {
            de: `Der Wein erinnert mich an ${finalDeWord}.`,
            en: `The wine reminds me of ${finalEnWord}.`,
            zh: `这酒让我想起了${finalZhWord}。`
          },
          {
            de: `Wir genießen diesen Wein mit ${finalDeWord}.`,
            en: `We enjoy this wine with ${finalEnWord}.`,
            zh: `我们享受这带有${finalZhWord}的酒。`
          }
        );
      }
    }

    // 随机选择一个模板（或使用第一个）
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)] || templates[0];
    
    return selectedTemplate;
  };

  // 自动翻译和生成示例
  const handleAutoTranslate = async (field: 'word' | 'meaning' | 'meaningZh', value: string) => {
    if (!value.trim()) return;
    
    setIsTranslating(true);
    setLastEditedField(field);

    try {
      if (field === 'word') {
        // 从德语翻译到英语和中文
        const [enTranslation, zhTranslation] = await Promise.all([
          translateText(value, 'de', 'en'),
          translateText(value, 'de', 'zh'),
        ]);
        
        setFormData(prev => ({
          ...prev,
          word: value,
          meaning: enTranslation || prev.meaning,
          meaningZh: zhTranslation || prev.meaningZh,
        }));

        // 生成示例句子 - 使用原始输入的单词和翻译结果
        // 即使翻译失败，也使用原始单词生成示例
        const finalEnWord = enTranslation || value;
        const finalZhWord = zhTranslation || value;
        
        const examples = await generateExamples(value, finalEnWord, finalZhWord, 1);
        const firstExample = examples[0] || { de: '', en: '', zh: '' };
        
        setFormData(prev => ({
          ...prev,
          example: prev.example || firstExample.de,
          exampleEn: prev.exampleEn || firstExample.en,
          exampleZh: prev.exampleZh || firstExample.zh,
        }));
      } else if (field === 'meaning') {
        // 从英语翻译到德语和中文
        const [deTranslation, zhTranslation] = await Promise.all([
          translateText(value, 'en', 'de'),
          translateText(value, 'en', 'zh'),
        ]);
        
        setFormData(prev => ({
          ...prev,
          meaning: value,
          word: deTranslation || prev.word,
          meaningZh: zhTranslation || prev.meaningZh,
        }));

        // 生成示例 - 使用翻译结果和原始输入的单词
        const finalDeWord = deTranslation || value;
        const finalZhWord = zhTranslation || value;
        
        const examples = await generateExamples(finalDeWord, value, finalZhWord, 1);
        const firstExample = examples[0] || { de: '', en: '', zh: '' };
        
        setFormData(prev => ({
          ...prev,
          example: prev.example || firstExample.de,
          exampleEn: prev.exampleEn || firstExample.en,
          exampleZh: prev.exampleZh || firstExample.zh,
        }));
      } else if (field === 'meaningZh') {
        // 从中文翻译到德语和英语
        const [deTranslation, enTranslation] = await Promise.all([
          translateText(value, 'zh', 'de'),
          translateText(value, 'zh', 'en'),
        ]);
        
        setFormData(prev => ({
          ...prev,
          meaningZh: value,
          word: deTranslation || prev.word,
          meaning: enTranslation || prev.meaning,
        }));

        // 生成示例 - 使用翻译结果和原始输入的单词
        const finalDeWord = deTranslation || value;
        const finalEnWord = enTranslation || value;
        
        const examples = await generateExamples(finalDeWord, finalEnWord, value, 1);
        const firstExample = examples[0] || { de: '', en: '', zh: '' };
        
        setFormData(prev => ({
          ...prev,
          example: prev.example || firstExample.de,
          exampleEn: prev.exampleEn || firstExample.en,
          exampleZh: prev.exampleZh || firstExample.zh,
        }));
      }
    } catch (error) {
      console.error('Auto-translate error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 防抖处理输入变化
  const handleInputChange = (field: 'word' | 'meaning' | 'meaningZh', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLastEditedField(field);

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 设置新的定时器，延迟1.5秒后自动翻译（给用户时间完成输入）
    debounceTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        handleAutoTranslate(field, value);
      }
    }, 1500);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 重置表单
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        word: '',
        meaning: '',
        meaningZh: '',
        example: '',
        exampleEn: '',
        exampleZh: '',
      });
      setLastEditedField(null);
      setExampleOptions([]);
      setShowExampleOptions(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.word && formData.meaning && formData.meaningZh) {
      // 清理所有数据后再保存
      const cleanedData = {
        word: cleanText(formData.word),
        meaning: cleanText(formData.meaning),
        meaningZh: cleanText(formData.meaningZh),
        example: cleanText(formData.example),
        exampleEn: cleanText(formData.exampleEn),
        exampleZh: cleanText(formData.exampleZh),
      };
      
      // 验证必填字段
      if (cleanedData.word && cleanedData.meaning && cleanedData.meaningZh) {
        onSave(cleanedData);
        setFormData({
          word: '',
          meaning: '',
          meaningZh: '',
          example: '',
          exampleEn: '',
          exampleZh: '',
        });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {locale === 'de' ? 'Neues Wort hinzufügen' : locale === 'zh' ? '添加新词汇' : 'Add New Vocabulary'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {locale === 'de' ? 'Fügen Sie ein deutsches Wort hinzu, das Sie lernen möchten' : 
           locale === 'zh' ? '添加您想学习的德语单词' : 
           'Add a German word you want to learn'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 提示信息 */}
          {isTranslating && (
            <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 mb-4">
              <p className="text-sm text-blue-800 font-medium">
                {locale === 'zh' ? '🔄 正在自动翻译并生成示例...' : 
                 locale === 'de' ? '🔄 Automatische Übersetzung läuft...' : 
                 '🔄 Auto-translating...'}
              </p>
            </div>
          )}

          {/* 第一步：德语词 */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <label className="block text-sm font-black text-blue-900 mb-1">
              {locale === 'de' ? '1. Deutsches Wort (在任意一栏输入，其他栏会自动填充)' : 
               locale === 'zh' ? '1. 德语词（在任意一栏输入，其他栏会自动填充）' : 
               '1. German Word (Enter in any field, others will auto-fill)'} *
            </label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => {
                setLastEditedField('word');
                handleInputChange('word', e.target.value);
              }}
              placeholder={locale === 'zh' ? '例如：verschwenderisch' : 'e.g., verschwenderisch'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
              required
            />
          </div>

          {/* 第二步：英语翻译 */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <label className="block text-sm font-black text-purple-900 mb-1">
              {locale === 'de' ? '2. Englische Bedeutung (自动填充)' : 
               locale === 'zh' ? '2. 英语翻译（自动填充）' : 
               '2. English Translation (Auto-filled)'} *
            </label>
            <input
              type="text"
              value={formData.meaning}
              onChange={(e) => {
                setLastEditedField('meaning');
                handleInputChange('meaning', e.target.value);
              }}
              placeholder={locale === 'zh' ? '例如：wasteful, extravagant' : 'e.g., wasteful, extravagant'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium bg-white"
              required
            />
          </div>

          {/* 第三步：中文翻译 */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
            <label className="block text-sm font-black text-green-900 mb-1">
              {locale === 'de' ? '3. Chinesische Bedeutung (自动填充)' : 
               locale === 'zh' ? '3. 中文翻译（自动填充）' : 
               '3. Chinese Translation (Auto-filled)'} *
            </label>
            <input
              type="text"
              value={formData.meaningZh}
              onChange={(e) => {
                setLastEditedField('meaningZh');
                handleInputChange('meaningZh', e.target.value);
              }}
              placeholder={locale === 'zh' ? '例如：浪费的，奢侈的' : 'e.g., 浪费的，奢侈的'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium bg-white"
              required
            />
          </div>

          {/* 第四步：使用示例（自动生成） */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-black text-yellow-900">
                {locale === 'de' ? '4. Verwendungsbeispiele (自动生成短语和短句)' : 
                 locale === 'zh' ? '4. 使用示例（自动生成短语和短句）' : 
                 '4. Usage Examples (Auto-generated phrases and sentences)'}
              </label>
              <button
                type="button"
                onClick={async () => {
                  // 清空示例
                  setFormData(prev => ({
                    ...prev,
                    example: '',
                    exampleEn: '',
                    exampleZh: '',
                  }));
                  
                  // 如果三个单词都有值，自动重新生成多个例句选项
                  const currentWord = formData.word.trim();
                  const currentEn = formData.meaning.trim();
                  const currentZh = formData.meaningZh.trim();
                  
                  if (currentWord && currentEn && currentZh) {
                    setIsTranslating(true);
                    try {
                      // 生成5个不同的例句选项
                      const examples = await generateExamples(currentWord, currentEn, currentZh, 5);
                      if (examples && examples.length > 0) {
                        // 显示所有选项供用户选择
                        setExampleOptions(examples);
                        setShowExampleOptions(true);
                        // 默认选择第一个
                        const firstExample = examples[0];
                        setFormData(prev => ({
                          ...prev,
                          example: firstExample.de,
                          exampleEn: firstExample.en,
                          exampleZh: firstExample.zh,
                        }));
                      }
                    } catch (error) {
                      console.error('Failed to regenerate examples:', error);
                    } finally {
                      setIsTranslating(false);
                    }
                  }
                }}
                className="px-3 py-1 bg-yellow-500 text-white border-2 border-gray-900 rounded-lg text-xs font-black hover:bg-yellow-600 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
                title={locale === 'zh' ? '清空并重新生成示例' : locale === 'de' ? 'Beispiele löschen und neu generieren' : 'Clear and regenerate examples'}
              >
                {locale === 'zh' ? '🔄 重新生成' : locale === 'de' ? '🔄 Neu generieren' : '🔄 Regenerate'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {locale === 'zh' ? '💡 输入单词后会自动生成包含该单词的三语例句' : 
               locale === 'de' ? '💡 Beispiele werden automatisch generiert' : 
               '💡 Examples will be auto-generated'}
            </p>
            
            {/* 例句选项选择器 */}
            {showExampleOptions && exampleOptions.length > 1 && (
              <div className="mb-3 p-2 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-xs font-bold text-blue-900 mb-2">
                  {locale === 'zh' ? '📝 选择您喜欢的例句（点击重新生成可查看更多选项）' : 
                   locale === 'de' ? '📝 Wählen Sie Ihr bevorzugtes Beispiel' : 
                   '📝 Choose your preferred example'}
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {exampleOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          example: option.de,
                          exampleEn: option.en,
                          exampleZh: option.zh,
                        }));
                        setShowExampleOptions(false);
                      }}
                      className={`w-full text-left p-2 rounded border-2 transition-colors ${
                        formData.example === option.de
                          ? 'bg-blue-200 border-blue-500'
                          : 'bg-white border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="text-xs">
                        <div className="font-semibold text-gray-800">{option.de}</div>
                        <div className="text-gray-600">{option.en}</div>
                        <div className="text-green-700">{option.zh}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowExampleOptions(false)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  {locale === 'zh' ? '收起选项' : locale === 'de' ? 'Ausblenden' : 'Hide options'}
                </button>
              </div>
            )}
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {locale === 'zh' ? '德语例句' : 'German Example'}
                </label>
                <input
                  type="text"
                  value={formData.example}
                  onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                  placeholder={locale === 'zh' ? '自动生成或手动输入' : 'Auto-generated or enter manually'}
                  className="w-full px-3 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-medium bg-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {locale === 'zh' ? '英语例句' : 'English Example'}
                </label>
                <input
                  type="text"
                  value={formData.exampleEn}
                  onChange={(e) => setFormData({ ...formData, exampleEn: e.target.value })}
                  placeholder={locale === 'zh' ? '自动生成或手动输入' : 'Auto-generated or enter manually'}
                  className="w-full px-3 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-medium bg-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {locale === 'zh' ? '中文例句' : 'Chinese Example'}
                </label>
                <input
                  type="text"
                  value={formData.exampleZh}
                  onChange={(e) => setFormData({ ...formData, exampleZh: e.target.value })}
                  placeholder={locale === 'zh' ? '自动生成或手动输入' : 'Auto-generated or enter manually'}
                  className="w-full px-3 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-medium bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white border-2 border-gray-900 rounded-lg font-black hover:bg-green-600 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
            >
              {locale === 'de' ? 'Speichern' : locale === 'zh' ? '保存' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 border-2 border-gray-900 rounded-lg font-black hover:bg-gray-300 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
            >
              {locale === 'de' ? 'Abbrechen' : locale === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

