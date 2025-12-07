import { NextRequest, NextResponse } from 'next/server';

/**
 * 生成例句API
 * 使用大语言模型或词典API生成更自然、符合语境的例句
 * 支持多种方式：
 * 1. OpenAI API (如果配置了OPENAI_API_KEY)
 * 2. 免费词典API
 * 3. 智能模板生成（fallback）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, enWord, zhWord, language, count = 3 } = body;

    if (!word || !enWord || !zhWord) {
      return NextResponse.json(
        { error: 'Missing required parameters: word, enWord, zhWord' },
        { status: 400 }
      );
    }

    const exampleCount = Math.min(Math.max(parseInt(count) || 3, 1), 5); // 限制在1-5个之间

    // 方法1: 尝试使用OpenAI API（如果配置了）
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openaiExamples = await generateWithOpenAI(word, enWord, zhWord, openaiKey, exampleCount);
        if (openaiExamples && openaiExamples.length > 0) {
          return NextResponse.json({
            examples: openaiExamples,
            source: 'openai',
          });
        }
      } catch (openaiError) {
        console.log('OpenAI API failed, trying dictionary API');
      }
    }

    // 方法2: 尝试使用免费的词典API
    try {
      const dictResponse = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(enWord)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WineBlog/1.0)',
          },
        }
      );

      if (dictResponse.ok) {
        const dictData = await dictResponse.json();
        if (dictData && dictData[0] && dictData[0].meanings) {
          // 从词典中提取例句
          const examples: string[] = [];
          dictData[0].meanings.forEach((meaning: any) => {
            meaning.definitions?.forEach((def: any) => {
              if (def.example) {
                examples.push(def.example);
              }
            });
          });

          if (examples.length > 0) {
            // 使用词典中的多个例句，并翻译成其他语言
            const dictExamples = [];
            const maxExamples = Math.min(examples.length, exampleCount);
            
            for (let i = 0; i < maxExamples; i++) {
              const example = examples[i];
              const deExample = await translateExample(example, 'en', 'de');
              const zhExample = await translateExample(example, 'en', 'zh');
              
              if (deExample && zhExample && deExample !== example && zhExample !== example) {
                dictExamples.push({
                  en: example,
                  de: deExample,
                  zh: zhExample,
                });
              }
            }
            
            if (dictExamples.length > 0) {
              // 如果词典例句不够，用模板补充
              while (dictExamples.length < exampleCount) {
                const templateExample = generateSmartExamples(word, enWord, zhWord);
                dictExamples.push(templateExample);
              }
              
              return NextResponse.json({
                examples: dictExamples,
                source: 'dictionary',
              });
            }
          }
        }
      }
    } catch (dictError) {
      console.log('Dictionary API not available, using template');
    }

    // 方法3: 使用改进的模板生成多个例句（作为fallback）
    const examples = [];
    for (let i = 0; i < exampleCount; i++) {
      examples.push(generateSmartExamples(word, enWord, zhWord, i));
    }
    
    return NextResponse.json({
      examples: examples,
      source: 'template',
    });
  } catch (error) {
    console.error('Generate examples error:', error);
    return NextResponse.json(
      { error: 'Failed to generate examples' },
      { status: 500 }
    );
  }
}

// 使用OpenAI生成多个例句
async function generateWithOpenAI(
  deWord: string,
  enWord: string,
  zhWord: string,
  apiKey: string,
  count: number = 3
): Promise<Array<{ de: string; en: string; zh: string }> | null> {
  try {
    const prompt = `Generate ${count} different example sentences for language learning:
- German word: ${deWord}
- English translation: ${enWord}
- Chinese translation: ${zhWord}

Please generate ${count} different natural sentences using "${deWord}" in wine-related contexts. Each sentence should be:
1. Natural and contextually appropriate
2. Different from the others (various situations, contexts, or styles)
3. Suitable for language learners

Format as JSON array:
[
  {
    "de": "German sentence 1",
    "en": "English sentence 1",
    "zh": "Chinese sentence 1"
  },
  {
    "de": "German sentence 2",
    "en": "English sentence 2",
    "zh": "Chinese sentence 2"
  },
  ...
]

Make sure each sentence is unique and demonstrates different uses of the word.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful language learning assistant. Generate natural example sentences in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (content) {
        // 尝试解析JSON数组
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const examples = JSON.parse(jsonMatch[0]);
          if (Array.isArray(examples) && examples.length > 0) {
            // 验证每个例句都有所有必需的字段
            const validExamples = examples.filter(
              (ex: any) => ex.de && ex.en && ex.zh
            );
            if (validExamples.length > 0) {
              return validExamples;
            }
          }
        }
        // 如果数组解析失败，尝试单个对象
        const singleMatch = content.match(/\{[\s\S]*\}/);
        if (singleMatch) {
          const example = JSON.parse(singleMatch[0]);
          if (example.de && example.en && example.zh) {
            return [example];
          }
        }
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
  }
  return null;
}

// 翻译例句的辅助函数
async function translateExample(text: string, from: string, to: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
    );
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText || text;
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
  return text;
}

// 智能生成例句（改进的模板方法）
function generateSmartExamples(
  deWord: string,
  enWord: string,
  zhWord: string,
  variant: number = 0
): {
  de: string;
  en: string;
  zh: string;
} {
  const wordLower = deWord.toLowerCase();
  
  // 检测词性
  const isAdjective = deWord.endsWith('isch') || deWord.endsWith('lich') || deWord.endsWith('ig');
  const isNoun = deWord[0] === deWord[0].toUpperCase() && !deWord.includes(' ');
  const isVerb = deWord.endsWith('en') || deWord.endsWith('n');
  
  // 葡萄酒相关词汇检测
  const wineWords = ['wein', 'rotwein', 'weißwein', 'champagner', 'sekt'];
  const isWineWord = wineWords.some(w => wordLower.includes(w));
  
  // 地区词汇
  const regionWords = ['mosel', 'rhein', 'baden', 'franken', 'pfalz'];
  const isRegion = regionWords.some(w => wordLower.includes(w));
  
  // 葡萄品种
  const grapeWords = ['riesling', 'spätburgunder', 'gewürztraminer', 'müller', 'dornfelder'];
  const isGrape = grapeWords.some(w => wordLower.includes(w));

  // 根据不同类型和变体生成不同的例句
  const templates: Array<{ de: string; en: string; zh: string }> = [];
  
  if (isAdjective) {
    templates.push(
      { de: `Dieser Wein schmeckt ${deWord}.`, en: `This wine tastes ${enWord}.`, zh: `这酒尝起来${zhWord}。` },
      { de: `Der Wein ist sehr ${deWord}.`, en: `The wine is very ${enWord}.`, zh: `这酒非常${zhWord}。` },
      { de: `Ein ${deWord}er Geschmack.`, en: `A ${enWord} taste.`, zh: `一种${zhWord}的味道。` },
      { de: `Ich finde diesen Wein ${deWord}.`, en: `I find this wine ${enWord}.`, zh: `我觉得这酒${zhWord}。` },
      { de: `Wir trinken diesen ${deWord}en Wein.`, en: `We drink this ${enWord} wine.`, zh: `我们喝这${zhWord}的酒。` }
    );
  } else if (isWineWord) {
    templates.push(
      { de: `Ich trinke gerne ${deWord} zum Abendessen.`, en: `I like to drink ${enWord} with dinner.`, zh: `我喜欢在晚餐时喝${zhWord}。` },
      { de: `${deWord} passt gut zu Käse.`, en: `${enWord} pairs well with cheese.`, zh: `${zhWord}配奶酪很好。` },
      { de: `Ein Glas ${deWord} zum Feiern.`, en: `A glass of ${enWord} to celebrate.`, zh: `一杯${zhWord}来庆祝。` },
      { de: `Der Geschmack dieses ${deWord}s ist einzigartig.`, en: `The taste of this ${enWord} is unique.`, zh: `这${zhWord}的味道很独特。` },
      { de: `Wir genießen ${deWord} zusammen.`, en: `We enjoy ${enWord} together.`, zh: `我们一起享受${zhWord}。` }
    );
  } else if (isRegion) {
    templates.push(
      { de: `Dieser Wein kommt aus ${deWord}.`, en: `This wine comes from ${enWord}.`, zh: `这酒来自${zhWord}。` },
      { de: `Die Weine aus ${deWord} sind berühmt.`, en: `Wines from ${enWord} are famous.`, zh: `来自${zhWord}的酒很有名。` },
      { de: `Ich mag die Weine aus ${deWord}.`, en: `I like wines from ${enWord}.`, zh: `我喜欢来自${zhWord}的酒。` },
      { de: `${deWord} ist eine bekannte Weinregion.`, en: `${enWord} is a famous wine region.`, zh: `${zhWord}是著名的葡萄酒产区。` },
      { de: `Der Wein aus ${deWord} hat ein besonderes Aroma.`, en: `The wine from ${enWord} has a special aroma.`, zh: `来自${zhWord}的酒有特殊的香气。` }
    );
  } else if (isGrape) {
    templates.push(
      { de: `${deWord} ist eine beliebte Rebsorte.`, en: `${enWord} is a popular grape variety.`, zh: `${zhWord}是一种受欢迎的葡萄品种。` },
      { de: `Weine aus ${deWord} schmecken fruchtig.`, en: `Wines made from ${enWord} taste fruity.`, zh: `用${zhWord}酿的酒尝起来有果味。` },
      { de: `Ich mag Weine aus ${deWord}.`, en: `I like wines made from ${enWord}.`, zh: `我喜欢用${zhWord}酿的酒。` },
      { de: `${deWord} wächst gut in Deutschland.`, en: `${enWord} grows well in Germany.`, zh: `${zhWord}在德国生长得很好。` },
      { de: `Der Wein aus ${deWord} ist besonders.`, en: `The wine from ${enWord} is special.`, zh: `用${zhWord}酿的酒很特别。` }
    );
  } else if (isNoun) {
    templates.push(
      { de: `Der Wein passt gut zu ${deWord}.`, en: `The wine pairs well with ${enWord}.`, zh: `这酒配${zhWord}很好。` },
      { de: `Dieser Wein hat Noten von ${deWord}.`, en: `This wine has notes of ${enWord}.`, zh: `这酒有${zhWord}的味道。` },
      { de: `Ich schmecke ${deWord} in diesem Wein.`, en: `I taste ${enWord} in this wine.`, zh: `我在这酒中尝到了${zhWord}。` },
      { de: `Der Wein erinnert mich an ${deWord}.`, en: `The wine reminds me of ${enWord}.`, zh: `这酒让我想起了${zhWord}。` },
      { de: `Wir genießen diesen Wein mit ${deWord}.`, en: `We enjoy this wine with ${enWord}.`, zh: `我们享受这带有${zhWord}的酒。` }
    );
  } else if (isVerb) {
    templates.push(
      { de: `Ich ${deWord} diesen Wein gerne.`, en: `I like to ${enWord} this wine.`, zh: `我喜欢${zhWord}这酒。` },
      { de: `Wir ${deWord} den Wein zusammen.`, en: `We ${enWord} the wine together.`, zh: `我们一起${zhWord}这酒。` },
      { de: `Kannst du mir zeigen, wie man ${deWord}?`, en: `Can you show me how to ${enWord}?`, zh: `你能教我如何${zhWord}吗？` },
      { de: `Ich möchte lernen, wie man ${deWord}.`, en: `I want to learn how to ${enWord}.`, zh: `我想学习如何${zhWord}。` },
      { de: `Wir ${deWord} den Wein zu besonderen Anlässen.`, en: `We ${enWord} the wine on special occasions.`, zh: `我们在特殊场合${zhWord}这酒。` }
    );
  } else {
    templates.push(
      { de: `Dieser Wein hat einen Geschmack von ${deWord}.`, en: `This wine has a taste of ${enWord}.`, zh: `这酒有${zhWord}的味道。` },
      { de: `Der Wein passt gut zu ${deWord}.`, en: `The wine pairs well with ${enWord}.`, zh: `这酒配${zhWord}很好。` },
      { de: `Ich schmecke ${deWord} in diesem Wein.`, en: `I taste ${enWord} in this wine.`, zh: `我在这酒中尝到了${zhWord}。` },
      { de: `Der Wein erinnert mich an ${deWord}.`, en: `The wine reminds me of ${enWord}.`, zh: `这酒让我想起了${zhWord}。` },
      { de: `Wir genießen diesen Wein mit ${deWord}.`, en: `We enjoy this wine with ${enWord}.`, zh: `我们享受这带有${zhWord}的酒。` }
    );
  }
  
  // 根据variant选择不同的模板（循环使用）
  const selectedTemplate = templates[variant % templates.length];
  return selectedTemplate;
}

