"use client";

import { useState, useEffect } from "react";

const MAX_HISTORY = 5;
const HISTORY_KEY = "produk-search-history";

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  function addToHistory(query: string) {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter(q => q !== query)].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore storage errors
    }
  }

  function removeFromHistory(query: string) {
    const newHistory = history.filter(q => q !== query);
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore storage errors
    }
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  return { history, addToHistory, removeFromHistory, clearHistory };
}