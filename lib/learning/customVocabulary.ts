// 用户自定义词汇和短语管理工具
const CUSTOM_VOCABULARY_KEY = 'wein-blog-custom-vocabulary';
const CUSTOM_TERMS_KEY = 'wein-blog-custom-terms';
const CUSTOM_DIALOGUES_KEY = 'wein-blog-custom-dialogues';

// 词汇接口
export interface CustomVocabulary {
  id: string;
  word: string;
  meaning: string;
  meaningZh: string;
  example: string;
  exampleEn: string;
  exampleZh: string;
}

// 术语接口
export interface CustomTerm {
  id: string;
  en: string;
  de: string;
  zh: string;
  category?: string;
}

// 对话接口
export interface CustomDialogue {
  id: string;
  en: string;
  de: string;
  zh: string;
  scenario?: string;
}

// 获取所有自定义词汇
export function getCustomVocabulary(): CustomVocabulary[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_VOCABULARY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 添加自定义词汇
export function addCustomVocabulary(vocab: Omit<CustomVocabulary, 'id'>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomVocabulary();
    const newVocab: CustomVocabulary = {
      ...vocab,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    existing.push(newVocab);
    localStorage.setItem(CUSTOM_VOCABULARY_KEY, JSON.stringify(existing));
  } catch {
    // 忽略错误
  }
}

// 删除自定义词汇
export function deleteCustomVocabulary(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomVocabulary();
    const filtered = existing.filter(v => v.id !== id);
    localStorage.setItem(CUSTOM_VOCABULARY_KEY, JSON.stringify(filtered));
  } catch {
    // 忽略错误
  }
}

// 获取所有自定义术语
export function getCustomTerms(): CustomTerm[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_TERMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 添加自定义术语
export function addCustomTerm(term: Omit<CustomTerm, 'id'>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomTerms();
    const newTerm: CustomTerm = {
      ...term,
      id: `custom-term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    existing.push(newTerm);
    localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(existing));
  } catch {
    // 忽略错误
  }
}

// 删除自定义术语
export function deleteCustomTerm(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomTerms();
    const filtered = existing.filter(t => t.id !== id);
    localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(filtered));
  } catch {
    // 忽略错误
  }
}

// 获取所有自定义对话
export function getCustomDialogues(): CustomDialogue[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_DIALOGUES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 添加自定义对话
export function addCustomDialogue(dialogue: Omit<CustomDialogue, 'id'>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomDialogues();
    const newDialogue: CustomDialogue = {
      ...dialogue,
      id: `custom-dialogue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    existing.push(newDialogue);
    localStorage.setItem(CUSTOM_DIALOGUES_KEY, JSON.stringify(existing));
  } catch {
    // 忽略错误
  }
}

// 删除自定义对话
export function deleteCustomDialogue(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCustomDialogues();
    const filtered = existing.filter(d => d.id !== id);
    localStorage.setItem(CUSTOM_DIALOGUES_KEY, JSON.stringify(filtered));
  } catch {
    // 忽略错误
  }
}

