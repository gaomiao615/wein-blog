'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AddVocabularyModal } from '@/components/AddVocabularyModal';
import { AddDialogueModal } from '@/components/AddDialogueModal';
import {
  getCustomVocabulary,
  addCustomVocabulary,
  deleteCustomVocabulary,
  getCustomDialogues,
  addCustomDialogue,
  deleteCustomDialogue,
  type CustomVocabulary as CustomVocabType,
  type CustomDialogue as CustomDialogueType,
} from '@/lib/learning/customVocabulary';

// 扩展的德语词汇数据（包含完整的三语翻译）
const vocabulary = [
  {
    word: 'trocken',
    meaning: 'dry',
    meaningZh: '干型',
    example: 'Dieser Wein ist sehr trocken.',
    exampleEn: 'This wine is very dry.',
    exampleZh: '这酒非常干。',
  },
  {
    word: 'fruchtig',
    meaning: 'fruity',
    meaningZh: '果味',
    example: 'Ein fruchtiger Weißwein.',
    exampleEn: 'A fruity white wine.',
    exampleZh: '一款果味白葡萄酒。',
  },
  {
    word: 'kräftig',
    meaning: 'full-bodied',
    meaningZh: '饱满',
    example: 'Ein kräftiger Rotwein.',
    exampleEn: 'A full-bodied red wine.',
    exampleZh: '一款饱满的红葡萄酒。',
  },
  {
    word: 'süß',
    meaning: 'sweet',
    meaningZh: '甜型',
    example: 'Ein süßer Dessertwein.',
    exampleEn: 'A sweet dessert wine.',
    exampleZh: '一款甜型甜酒。',
  },
  {
    word: 'säure',
    meaning: 'acidity',
    meaningZh: '酸度',
    example: 'Die Säure ist gut ausbalanciert.',
    exampleEn: 'The acidity is well balanced.',
    exampleZh: '酸度很平衡。',
  },
  {
    word: 'elegant',
    meaning: 'elegant',
    meaningZh: '优雅',
    example: 'Ein eleganter Burgunder.',
    exampleEn: 'An elegant Burgundy.',
    exampleZh: '一款优雅的勃艮第。',
  },
  {
    word: 'mineralisch',
    meaning: 'mineral',
    meaningZh: '矿物感',
    example: 'Der Wein hat einen mineralischen Geschmack.',
    exampleEn: 'The wine has a mineral taste.',
    exampleZh: '这酒有矿物味。',
  },
  {
    word: 'ausgewogen',
    meaning: 'balanced',
    meaningZh: '平衡',
    example: 'Ein ausgewogener Wein.',
    exampleEn: 'A balanced wine.',
    exampleZh: '一款平衡的葡萄酒。',
  },
  {
    word: 'komplex',
    meaning: 'complex',
    meaningZh: '复杂',
    example: 'Ein komplexer Wein mit vielen Aromen.',
    exampleEn: 'A complex wine with many aromas.',
    exampleZh: '一款带有多种香气的复杂葡萄酒。',
  },
  {
    word: 'sanft',
    meaning: 'smooth',
    meaningZh: '柔顺',
    example: 'Sanfte Tannine.',
    exampleEn: 'Smooth tannins.',
    exampleZh: '柔顺的单宁。',
  },
  {
    word: 'reich',
    meaning: 'rich',
    meaningZh: '丰富',
    example: 'Ein reicher, vollmundiger Wein.',
    exampleEn: 'A rich, full-bodied wine.',
    exampleZh: '一款丰富饱满的葡萄酒。',
  },
  {
    word: 'knackig',
    meaning: 'crisp',
    meaningZh: '清爽',
    example: 'Ein knackiger Weißwein.',
    exampleEn: 'A crisp white wine.',
    exampleZh: '一款清爽的白葡萄酒。',
  },
];

// 情景对话
const scenarios = [
  {
    title: 'At Restaurant',
    titleDe: 'Im Restaurant',
    titleZh: '在餐厅',
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
    ]
  },
  {
    title: 'Buying Wine',
    titleDe: 'Wein kaufen',
    titleZh: '购买葡萄酒',
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
    ]
  },
  {
    title: 'Wine Tasting',
    titleDe: 'Weinverkostung',
    titleZh: '品酒',
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
    ]
  },
];

export default function LearningPage() {
  const { t, locale } = useI18n();
  const [customVocabs, setCustomVocabs] = useState<CustomVocabType[]>([]);
  const [customDialogues, setCustomDialogues] = useState<CustomDialogueType[]>([]);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [showDialogueModal, setShowDialogueModal] = useState(false);
  const [dialogueScenario, setDialogueScenario] = useState<string>('');

  // 加载用户自定义内容
  useEffect(() => {
    setCustomVocabs(getCustomVocabulary());
    setCustomDialogues(getCustomDialogues());
  }, []);

  // 合并默认词汇和用户添加的词汇
  const allVocabulary = [...vocabulary, ...customVocabs];

  // 合并默认对话和用户添加的对话
  const allScenarios = scenarios.map(scenario => {
    const matchingDialogues = customDialogues.filter(d => {
      if (!d.scenario) return false;
      // 匹配场景标题（支持多语言）
      return d.scenario === scenario.title || 
             d.scenario === scenario.titleDe || 
             d.scenario === scenario.titleZh ||
             d.scenario.toLowerCase() === scenario.title.toLowerCase() ||
             d.scenario.toLowerCase() === scenario.titleDe.toLowerCase() ||
             d.scenario.toLowerCase() === scenario.titleZh.toLowerCase();
    });
    return {
      ...scenario,
      dialogues: [...scenario.dialogues, ...matchingDialogues]
    };
  });

  const handleAddVocab = (vocab: Omit<CustomVocabType, 'id'>) => {
    addCustomVocabulary(vocab);
    setCustomVocabs(getCustomVocabulary());
  };

  const handleDeleteVocab = (id: string) => {
    deleteCustomVocabulary(id);
    setCustomVocabs(getCustomVocabulary());
  };

  const handleAddDialogue = (dialogue: Omit<CustomDialogueType, 'id'>) => {
    addCustomDialogue(dialogue);
    setCustomDialogues(getCustomDialogues());
  };

  const handleDeleteDialogue = (id: string) => {
    deleteCustomDialogue(id);
    setCustomDialogues(getCustomDialogues());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('learning.title')}</h1>
        <p className="text-xl text-gray-600">{t('learning.subtitle')}</p>
      </div>

      {/* 词汇表 - 漫画风格 */}
      <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-gray-900">
            {locale === 'de' ? 'Wichtige Begriffe' : locale === 'zh' ? '重要词汇' : 'Key Vocabulary'}
          </h2>
          <button
            onClick={() => setShowVocabModal(true)}
            className="px-4 py-2 bg-green-500 text-white border-2 border-gray-900 rounded-lg font-black text-sm hover:bg-green-600 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
          >
            + {locale === 'de' ? 'Hinzufügen' : locale === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allVocabulary.map((item, index) => {
            const isCustom = 'id' in item && item.id.startsWith('custom-');
            return (
              <div key={isCustom ? item.id : index} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-gray-900 rounded-lg p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.1)] relative">
                {isCustom && (
                  <button
                    onClick={() => handleDeleteVocab(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white border-2 border-gray-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                    title={locale === 'de' ? 'Löschen' : locale === 'zh' ? '删除' : 'Delete'}
                  >
                    ×
                  </button>
                )}
                <div className="text-lg font-black text-gray-900 mb-2">{item.word}</div>
                <div className="text-sm font-bold text-blue-600 mb-1">
                  {item.meaning} {item.meaningZh && <span className="text-green-600">({item.meaningZh})</span>}
                </div>
                <div className="space-y-1 mt-2">
                  {item.example && (
                    <div className="text-xs text-gray-700 font-medium">{item.example}</div>
                  )}
                  {item.exampleEn && (
                    <div className="text-xs text-gray-600">{item.exampleEn}</div>
                  )}
                  {item.exampleZh && (
                    <div className="text-xs text-green-700 font-medium">{item.exampleZh}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 情景对话 - 漫画风格 */}
      <div className="space-y-6">
        {allScenarios.map((scenario, scenarioIdx) => (
          <div key={scenarioIdx} className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-900">
                {locale === 'de' ? scenario.titleDe : locale === 'zh' ? scenario.titleZh : scenario.title}
              </h2>
              <button
                onClick={() => {
                  setDialogueScenario(scenario.title);
                  setShowDialogueModal(true);
                }}
                className="px-4 py-2 bg-green-500 text-white border-2 border-gray-900 rounded-lg font-black text-sm hover:bg-green-600 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
              >
                + {locale === 'de' ? 'Hinzufügen' : locale === 'zh' ? '添加' : 'Add'}
              </button>
            </div>
            <div className="space-y-3">
              {scenario.dialogues.map((dialogue, dialogueIdx) => {
                const isCustom = 'id' in dialogue && dialogue.id.startsWith('custom-dialogue-');
                return (
                  <div key={isCustom ? dialogue.id : dialogueIdx} className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-gray-900 rounded-lg p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] relative">
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteDialogue(dialogue.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white border-2 border-gray-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                        title={locale === 'de' ? 'Löschen' : locale === 'zh' ? '删除' : 'Delete'}
                      >
                        ×
                      </button>
                    )}
                    <div className="space-y-2">
                      <div className="text-sm font-black text-gray-900">
                        <span className="text-purple-600">EN:</span> {dialogue.en}
                      </div>
                      <div className="text-sm font-black text-blue-700">
                        <span className="text-blue-600">DE:</span> {dialogue.de}
                      </div>
                      <div className="text-sm font-black text-green-700">
                        <span className="text-green-600">ZH:</span> {dialogue.zh}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 模态框 */}
      <AddVocabularyModal
        isOpen={showVocabModal}
        onClose={() => setShowVocabModal(false)}
        onSave={handleAddVocab}
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

