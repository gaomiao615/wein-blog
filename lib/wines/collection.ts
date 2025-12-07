// 收藏管理工具
const COLLECTION_KEY = 'wein-blog-collection';
const NOTES_KEY = 'wein-blog-notes';

// 获取所有收藏的葡萄酒ID
export function getCollection(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 添加收藏
export function addToCollection(wineId: string): void {
  if (typeof window === 'undefined') return;
  const collection = getCollection();
  if (!collection.includes(wineId)) {
    collection.push(wineId);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }
}

// 移除收藏
export function removeFromCollection(wineId: string): void {
  if (typeof window === 'undefined') return;
  const collection = getCollection();
  const updated = collection.filter(id => id !== wineId);
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(updated));
}

// 检查是否已收藏
export function isInCollection(wineId: string): boolean {
  const collection = getCollection();
  return collection.includes(wineId);
}

// 切换收藏状态
export function toggleCollection(wineId: string): boolean {
  if (isInCollection(wineId)) {
    removeFromCollection(wineId);
    return false;
  } else {
    addToCollection(wineId);
    return true;
  }
}

// 保存笔记
export function saveNotes(wineId: string, notes: string): void {
  if (typeof window === 'undefined') return;
  try {
    const allNotes = getNotes();
    allNotes[wineId] = notes;
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
  } catch {
    // 忽略错误
  }
}

// 获取笔记
export function getNotes(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// 获取单个酒的笔记
export function getWineNotes(wineId: string): string {
  const allNotes = getNotes();
  return allNotes[wineId] || '';
}

