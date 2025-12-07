'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { Wine } from '@/lib/wines/data';
import { AddTermModal } from '@/components/AddTermModal';
import { AddDialogueModal } from '@/components/AddDialogueModal';
import {
  getCustomTerms,
  addCustomTerm,
  deleteCustomTerm,
  getCustomDialogues,
  addCustomDialogue,
  deleteCustomDialogue,
  type CustomTerm as CustomTermType,
  type CustomDialogue as CustomDialogueType,
} from '@/lib/learning/customVocabulary';

interface WineLearningProps {
  wine: Wine;
}

export function WineLearning({ wine }: WineLearningProps) {
  const { locale } = useI18n();
  const [customTerms, setCustomTerms] = useState<CustomTermType[]>([]);
  const [customDialogues, setCustomDialogues] = useState<CustomDialogueType[]>([]);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showDialogueModal, setShowDialogueModal] = useState(false);
  const [termCategory, setTermCategory] = useState<string>('');
  const [dialogueScenario, setDialogueScenario] = useState<string>('');

  // 加载用户自定义内容
  useEffect(() => {
    setCustomTerms(getCustomTerms());
    setCustomDialogues(getCustomDialogues());
  }, []);

  // 获取多语言名称
  const wineName = locale === 'de' && wine.nameDe ? wine.nameDe :
                   locale === 'zh' && wine.nameZh ? wine.nameZh :
                   wine.name;

  const wineNameEn = wine.name;
  const wineNameDe = wine.nameDe || wine.name;
  const wineNameZh = wine.nameZh || wine.name;

  // 获取多语言葡萄品种
  const grapes = locale === 'de' && wine.grapesDe ? wine.grapesDe :
                 locale === 'zh' && wine.grapesZh ? wine.grapesZh :
                 wine.grapes;

  const grapesEn = wine.grapes;
  const grapesDe = wine.grapesDe || wine.grapes;
  const grapesZh = wine.grapesZh || wine.grapes;

  // 获取多语言地区
  const region = locale === 'de' && wine.regionDe ? wine.regionDe :
                 locale === 'zh' && wine.regionZh ? wine.regionZh :
                 wine.region;

  const regionEn = wine.region;
  const regionDe = wine.regionDe || wine.region;
  const regionZh = wine.regionZh || wine.region;

  // 获取多语言国家
  const country = locale === 'de' && wine.countryDe ? wine.countryDe :
                  locale === 'zh' && wine.countryZh ? wine.countryZh :
                  wine.country;

  const countryEn = wine.country;
  const countryDe = wine.countryDe || wine.country;
  const countryZh = wine.countryZh || wine.country;

  // 获取多语言品鉴描述
  const tasting = locale === 'de' && wine.tastingDe ? wine.tastingDe :
                  locale === 'zh' && wine.tastingZh ? wine.tastingZh :
                  wine.tasting;

  const tastingEn = wine.tasting;
  const tastingDe = wine.tastingDe || wine.tasting;
  const tastingZh = wine.tastingZh || wine.tasting;

  // 获取多语言配餐建议
  const pairing = locale === 'de' && wine.pairingDe ? wine.pairingDe :
                  locale === 'zh' && wine.pairingZh ? wine.pairingZh :
                  wine.pairing;

  const pairingEn = wine.pairing;
  const pairingDe = wine.pairingDe || wine.pairing;
  const pairingZh = wine.pairingZh || wine.pairing;

  // 构建学习词汇表
  const vocabulary = [
    {
      term: wineNameEn,
      de: wineNameDe,
      zh: wineNameZh,
      category: 'Wine Name'
    },
    ...grapes.map((grape, idx) => ({
      term: grapesEn[idx],
      de: grapesDe[idx],
      zh: grapesZh[idx],
      category: 'Grape Variety'
    })),
    {
      term: regionEn,
      de: regionDe,
      zh: regionZh,
      category: 'Region'
    },
    {
      term: countryEn,
      de: countryDe,
      zh: countryZh,
      category: 'Country'
    }
  ];

  // 扩展的常用葡萄酒术语
  const defaultWineTerms = [
    { en: 'Dry', de: 'Trocken', zh: '干型' },
    { en: 'Sweet', de: 'Süß', zh: '甜型' },
    { en: 'Light', de: 'Leicht', zh: '轻盈' },
    { en: 'Full-bodied', de: 'Körperreich', zh: '饱满' },
    { en: 'Acidity', de: 'Säure', zh: '酸度' },
    { en: 'Tannin', de: 'Tannin', zh: '单宁' },
    { en: 'Aroma', de: 'Aroma', zh: '香气' },
    { en: 'Finish', de: 'Abgang', zh: '余味' },
    { en: 'Fruity', de: 'Fruchtig', zh: '果味' },
    { en: 'Elegant', de: 'Elegant', zh: '优雅' },
    { en: 'Crisp', de: 'Knackig', zh: '清爽' },
    { en: 'Smooth', de: 'Sanft', zh: '柔顺' },
    { en: 'Bold', de: 'Kühn', zh: '大胆' },
    { en: 'Complex', de: 'Komplex', zh: '复杂' },
    { en: 'Balanced', de: 'Ausgewogen', zh: '平衡' },
    { en: 'Mineral', de: 'Mineralisch', zh: '矿物感' },
  ];

  // 合并默认术语和用户添加的术语
  const wineTerms = [...defaultWineTerms, ...customTerms];

  const handleAddTerm = (term: Omit<CustomTermType, 'id'>) => {
    addCustomTerm(term);
    setCustomTerms(getCustomTerms());
  };

  const handleDeleteTerm = (id: string) => {
    deleteCustomTerm(id);
    setCustomTerms(getCustomTerms());
  };

  const handleAddDialogue = (dialogue: Omit<CustomDialogueType, 'id'>) => {
    addCustomDialogue(dialogue);
    setCustomDialogues(getCustomDialogues());
  };

  const handleDeleteDialogue = (id: string) => {
    deleteCustomDialogue(id);
    setCustomDialogues(getCustomDialogues());
  };

  // 情景对话 - 餐厅点酒
  const restaurantScenarios = [
    {
      scenario: locale === 'de' ? 'Im Restaurant' : locale === 'zh' ? '在餐厅' : 'At Restaurant',
      dialogues: [
        {
          en: 'Could you recommend a wine?',
          de: 'Können Sie einen Wein empfehlen?',
          zh: '您能推荐一款酒吗？'
        },
        {
          en: 'I would like a bottle of red wine.',
          de: 'Ich hätte gerne eine Flasche Rotwein.',
          zh: '我想要一瓶红葡萄酒。'
        },
        {
          en: 'What wine goes well with this dish?',
          de: 'Welcher Wein passt gut zu diesem Gericht?',
          zh: '什么酒配这道菜比较好？'
        },
        {
          en: 'A glass of white wine, please.',
          de: 'Ein Glas Weißwein, bitte.',
          zh: '请来一杯白葡萄酒。'
        },
        {
          en: 'This wine is excellent!',
          de: 'Dieser Wein ist ausgezeichnet!',
          zh: '这酒很棒！'
        }
      ]
    },
    {
      scenario: locale === 'de' ? 'Wein kaufen' : locale === 'zh' ? '购买葡萄酒' : 'Buying Wine',
      dialogues: [
        {
          en: 'Where can I find German wines?',
          de: 'Wo finde ich deutsche Weine?',
          zh: '我在哪里可以找到德国葡萄酒？'
        },
        {
          en: 'How much does this bottle cost?',
          de: 'Wie viel kostet diese Flasche?',
          zh: '这瓶酒多少钱？'
        },
        {
          en: 'Do you have wines from this region?',
          de: 'Haben Sie Weine aus dieser Region?',
          zh: '您有来自这个产区的酒吗？'
        },
        {
          en: 'I\'m looking for a dry white wine.',
          de: 'Ich suche einen trockenen Weißwein.',
          zh: '我在找一款干型白葡萄酒。'
        },
        {
          en: 'Can I taste this wine before buying?',
          de: 'Kann ich diesen Wein vor dem Kauf probieren?',
          zh: '我可以在购买前品尝这酒吗？'
        }
      ]
    },
    {
      scenario: locale === 'de' ? 'Weinverkostung' : locale === 'zh' ? '品酒' : 'Wine Tasting',
      dialogues: [
        {
          en: 'This wine has a fruity aroma.',
          de: 'Dieser Wein hat ein fruchtiges Aroma.',
          zh: '这酒有果香。'
        },
        {
          en: 'The acidity is well balanced.',
          de: 'Die Säure ist gut ausgewogen.',
          zh: '酸度很平衡。'
        },
        {
          en: 'I can taste notes of cherry and vanilla.',
          de: 'Ich schmecke Noten von Kirsche und Vanille.',
          zh: '我能尝到樱桃和香草的味道。'
        },
        {
          en: 'The finish is long and smooth.',
          de: 'Der Abgang ist lang und sanft.',
          zh: '余味悠长柔顺。'
        },
        {
          en: 'This wine pairs well with cheese.',
          de: 'Dieser Wein passt gut zu Käse.',
          zh: '这酒配奶酪很好。'
        }
      ]
    }
  ];

  // 扩展的葡萄酒描述词汇
  const descriptiveTerms = [
    { category: locale === 'de' ? 'Geschmack' : locale === 'zh' ? '味道' : 'Taste', terms: [
      { en: 'Fruity', de: 'Fruchtig', zh: '果味' },
      { en: 'Floral', de: 'Blumig', zh: '花香' },
      { en: 'Spicy', de: 'Würzig', zh: '辛辣' },
      { en: 'Earthy', de: 'Erdig', zh: '泥土味' },
      { en: 'Oaky', de: 'Eichig', zh: '橡木味' },
      { en: 'Buttery', de: 'Buttrig', zh: '黄油味' },
    ]},
    { category: locale === 'de' ? 'Textur' : locale === 'zh' ? '口感' : 'Texture', terms: [
      { en: 'Smooth', de: 'Sanft', zh: '柔顺' },
      { en: 'Velvety', de: 'Samtig', zh: '丝滑' },
      { en: 'Crisp', de: 'Knackig', zh: '清爽' },
      { en: 'Rich', de: 'Reich', zh: '丰富' },
      { en: 'Creamy', de: 'Cremig', zh: '奶油般' },
      { en: 'Tannic', de: 'Gerbstoffreich', zh: '单宁重' },
    ]},
    { category: locale === 'de' ? 'Qualität' : locale === 'zh' ? '品质' : 'Quality', terms: [
      { en: 'Excellent', de: 'Ausgezeichnet', zh: '优秀' },
      { en: 'Outstanding', de: 'Hervorragend', zh: '杰出' },
      { en: 'Fine', de: 'Fein', zh: '精致' },
      { en: 'Premium', de: 'Premium', zh: '高端' },
      { en: 'Well-balanced', de: 'Ausgewogen', zh: '平衡' },
      { en: 'Complex', de: 'Komplex', zh: '复杂' },
    ]}
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-6 border border-purple-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">
        {locale === 'de' ? 'Wein-Lernen' : locale === 'zh' ? '葡萄酒学习' : 'Wine Learning'}
      </h2>

      {/* 词汇表 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Wichtige Begriffe' : locale === 'zh' ? '重要词汇' : 'Key Vocabulary'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vocabulary.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{item.category}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800">{item.term}</span>
                <span className="text-purple-600">→</span>
                <span className="text-blue-600">{item.de}</span>
                <span className="text-purple-600">→</span>
                <span className="text-green-600">{item.zh}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 品鉴描述对比 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Geschmacksbeschreibung' : locale === 'zh' ? '品鉴描述' : 'Tasting Notes'}
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">English</div>
            <p className="text-gray-800">{tastingEn}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Deutsch</div>
            <p className="text-blue-700">{tastingDe}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">中文</div>
            <p className="text-green-700">{tastingZh}</p>
          </div>
        </div>
      </div>

      {/* 配餐建议对比 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Essensempfehlungen' : locale === 'zh' ? '配餐建议' : 'Food Pairing'}
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">English</div>
            <p className="text-gray-800">{pairingEn}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Deutsch</div>
            <p className="text-blue-700">{pairingDe}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">中文</div>
            <p className="text-green-700">{pairingZh}</p>
          </div>
        </div>
      </div>

      {/* 扩展的常用术语 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-700">
            {locale === 'de' ? 'Häufige Weintermine' : locale === 'zh' ? '常用术语' : 'Common Wine Terms'}
          </h3>
          <button
            onClick={() => {
              setTermCategory('');
              setShowTermModal(true);
            }}
            className="px-3 py-1.5 bg-green-500 text-white border-2 border-gray-900 rounded-lg font-black text-xs hover:bg-green-600 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
          >
            + {locale === 'de' ? 'Hinzufügen' : locale === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {wineTerms.map((term, idx) => {
            const isCustom = 'id' in term && term.id.startsWith('custom-term-');
            return (
              <div key={isCustom ? term.id : idx} className="bg-white rounded-lg p-2 shadow-sm text-center border-2 border-gray-200 relative">
                {isCustom && (
                  <button
                    onClick={() => handleDeleteTerm(term.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white border-2 border-gray-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                    title={locale === 'de' ? 'Löschen' : locale === 'zh' ? '删除' : 'Delete'}
                  >
                    ×
                  </button>
                )}
                <div className="text-sm font-semibold text-gray-800">{term.en}</div>
                <div className="text-xs text-blue-600 font-medium">{term.de}</div>
                <div className="text-xs text-green-600">{term.zh}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 描述性词汇分类 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-700">
            {locale === 'de' ? 'Beschreibende Begriffe' : locale === 'zh' ? '描述性词汇' : 'Descriptive Terms'}
          </h3>
        </div>
        <div className="space-y-4">
          {descriptiveTerms.map((category, catIdx) => {
            // 合并该分类下的自定义术语
            const categoryCustomTerms = customTerms.filter(t => t.category === category.category);
            const allCategoryTerms = [...category.terms, ...categoryCustomTerms];
            
            return (
              <div key={catIdx} className="bg-white rounded-lg p-4 shadow-sm border-2 border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-purple-800">{category.category}</h4>
                  <button
                    onClick={() => {
                      setTermCategory(category.category);
                      setShowTermModal(true);
                    }}
                    className="px-2 py-1 bg-green-500 text-white border-2 border-gray-900 rounded text-xs font-black hover:bg-green-600 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
                  >
                    + {locale === 'de' ? 'Hinzufügen' : locale === 'zh' ? '添加' : 'Add'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allCategoryTerms.map((term, termIdx) => {
                    const isCustom = 'id' in term && term.id.startsWith('custom-term-');
                    return (
                      <div key={isCustom ? term.id : termIdx} className="bg-gray-50 rounded p-2 text-center relative">
                        {isCustom && (
                          <button
                            onClick={() => handleDeleteTerm(term.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white border-2 border-gray-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                            title={locale === 'de' ? 'Löschen' : locale === 'zh' ? '删除' : 'Delete'}
                          >
                            ×
                          </button>
                        )}
                        <div className="text-xs font-semibold text-gray-800">{term.en}</div>
                        <div className="text-xs text-blue-600">{term.de}</div>
                        <div className="text-xs text-green-600">{term.zh}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 情景对话 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-700">
            {locale === 'de' ? 'Situationsdialoge' : locale === 'zh' ? '情景对话' : 'Situational Dialogues'}
          </h3>
        </div>
        <div className="space-y-4">
          {restaurantScenarios.map((scenario, scenarioIdx) => {
            // 合并该场景下的自定义对话
            const scenarioCustomDialogues = customDialogues.filter(d => {
              if (!d.scenario) return false;
              // 匹配场景标题（支持多语言）
              return d.scenario === scenario.scenario ||
                     d.scenario.toLowerCase() === scenario.scenario.toLowerCase() ||
                     (scenario.scenario === (locale === 'de' ? 'Im Restaurant' : locale === 'zh' ? '在餐厅' : 'At Restaurant') &&
                      (d.scenario === 'At Restaurant' || d.scenario === 'Im Restaurant' || d.scenario === '在餐厅')) ||
                     (scenario.scenario === (locale === 'de' ? 'Wein kaufen' : locale === 'zh' ? '购买葡萄酒' : 'Buying Wine') &&
                      (d.scenario === 'Buying Wine' || d.scenario === 'Wein kaufen' || d.scenario === '购买葡萄酒')) ||
                     (scenario.scenario === (locale === 'de' ? 'Weinverkostung' : locale === 'zh' ? '品酒' : 'Wine Tasting') &&
                      (d.scenario === 'Wine Tasting' || d.scenario === 'Weinverkostung' || d.scenario === '品酒'));
            });
            const allDialogues = [...scenario.dialogues, ...scenarioCustomDialogues];
            
            return (
              <div key={scenarioIdx} className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-blue-800">{scenario.scenario}</h4>
                  <button
                    onClick={() => {
                      setDialogueScenario(scenario.scenario);
                      setShowDialogueModal(true);
                    }}
                    className="px-2 py-1 bg-green-500 text-white border-2 border-gray-900 rounded text-xs font-black hover:bg-green-600 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
                  >
                    + {locale === 'de' ? 'Hinzufügen' : locale === 'zh' ? '添加' : 'Add'}
                  </button>
                </div>
                <div className="space-y-3">
                  {allDialogues.map((dialogue, dialogueIdx) => {
                    const isCustom = 'id' in dialogue && dialogue.id.startsWith('custom-dialogue-');
                    return (
                      <div key={isCustom ? dialogue.id : dialogueIdx} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border-l-4 border-purple-400 relative">
                        {isCustom && (
                          <button
                            onClick={() => handleDeleteDialogue(dialogue.id)}
                            className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white border-2 border-gray-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                            title={locale === 'de' ? 'Löschen' : locale === 'zh' ? '删除' : 'Delete'}
                          >
                            ×
                          </button>
                        )}
                        <div className="space-y-1">
                          <div className="text-sm text-gray-800 font-medium">
                            <span className="text-purple-600">EN:</span> {dialogue.en}
                          </div>
                          <div className="text-sm text-blue-700 font-medium">
                            <span className="text-blue-600">DE:</span> {dialogue.de}
                          </div>
                          <div className="text-sm text-green-700 font-medium">
                            <span className="text-green-600">ZH:</span> {dialogue.zh}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 模态框 */}
      <AddTermModal
        isOpen={showTermModal}
        onClose={() => {
          setShowTermModal(false);
          setTermCategory('');
        }}
        onSave={handleAddTerm}
        category={termCategory}
      />
      <AddDialogueModal
        isOpen={showDialogueModal}
        onClose={() => {
          setShowDialogueModal(false);
          setDialogueScenario('');
        }}
        onSave={handleAddDialogue}
        scenario={dialogueScenario}
      />
    </div>
  );
}

