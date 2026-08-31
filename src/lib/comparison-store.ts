"use client";

import { useSyncExternalStore } from "react";
import { COMPARISON_MAX } from "@/lib/constants";

const COMPARISON_KEY = "comparison_ids_v1";

let idsCache: string[] | null = null;
const listeners = new Set<() => void>();

function loadComparisonIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARISON_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  idsCache = ids;
  try {
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(ids));
  } catch {
    /* localStorage unavailable */
  }
  listeners.forEach((cb) => cb());
}

function refreshComparison() {
  idsCache = loadComparisonIds();
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", refreshComparison);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", refreshComparison);
  };
}

function getSnapshot(): string[] {
  if (idsCache === null) idsCache = loadComparisonIds();
  return idsCache;
}

const EMPTY_IDS: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function addComparison(id: string): string[] {
  const current = loadComparisonIds();
  if (current.includes(id)) return current;
  const next =
    current.length >= COMPARISON_MAX ? current : [...current, id];
  persist(next);
  return next;
}

export function removeComparison(id: string): string[] {
  const next = loadComparisonIds().filter((x) => x !== id);
  persist(next);
  return next;
}

export function toggleComparison(id: string): string[] {
  const current = loadComparisonIds();
  if (current.includes(id)) return removeComparison(id);
  return addComparison(id);
}

export function clearComparison(): void {
  persist([]);
}

export function useComparison(): {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  isFull: boolean;
  has: (id: string) => boolean;
} {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    items,
    add: addComparison,
    remove: removeComparison,
    toggle: toggleComparison,
    clear: clearComparison,
    isFull: items.length >= COMPARISON_MAX,
    has: (id: string) => items.includes(id),
  };
}