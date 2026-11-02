// 课外阅读「已读」记录 — which stories a student has marked as read
// (the 「读完了」 button at the end of each story; tapping 撤销 undoes it).
// Local only (localStorage), not synced: it just stamps 已读 on the shelf.
import { reactive } from "vue";

const KEY = "hsk-reading-read-v1"; // { "tiantiandu-2b": [1, 2, 5] }

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

const state = reactive(load());

export function useReading() {
  const isRead = (book, n) => !!state[book]?.includes(n);
  function markRead(book, n) {
    if (isRead(book, n)) return;
    state[book] = [...(state[book] || []), n].sort((a, b) => a - b);
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function unmarkRead(book, n) {
    if (!isRead(book, n)) return;
    state[book] = state[book].filter((x) => x !== n);
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  const readCount = (book) => state[book]?.length || 0;
  return { isRead, markRead, unmarkRead, readCount };
}
