'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SavedAction, MarketingTip } from '@/lib/ai/types';

const STORAGE_KEY = 'agenda:marketing-actions';

function loadFromStorage(): SavedAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedAction[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(actions: SavedAction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch {
    // ignore storage errors
  }
}

export function useSavedActions() {
  const [actions, setActions] = useState<SavedAction[]>([]);

  useEffect(() => {
    setActions(loadFromStorage());
  }, []);

  const saveAction = useCallback((tip: MarketingTip) => {
    setActions((prev) => {
      const alreadyExists = prev.some((a) => a.title === tip.title);
      if (alreadyExists) return prev;
      const newAction: SavedAction = {
        ...tip,
        status: 'pendente',
        savedAt: new Date().toISOString(),
      };
      const updated = [newAction, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: SavedAction['status']) => {
    setActions((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeAction = useCallback((id: string) => {
    setActions((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return { actions, saveAction, updateStatus, removeAction };
}
