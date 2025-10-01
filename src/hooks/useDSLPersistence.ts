'use client';

import { useCallback, useEffect, useState } from 'react';

const DSL_STORAGE_KEY = 'upflows_dsl_content';
const DSL_AUTO_SAVE_DELAY = 2000; // 2 segundos

export function useDSLPersistence(initialValue: string = '', hasErrors: boolean = false) {
  const [dslContent, setDslContent] = useState(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveToStorage = useCallback((content: string) => {
    if (typeof window !== 'undefined' && localStorage) {
      setIsAutoSaving(true);
      try {
        localStorage.setItem(DSL_STORAGE_KEY, content);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error saving DSL to localStorage:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }
  }, []);

  // Cargar DSL guardado al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage && !isInitialized) {
      // Use requestIdleCallback for better performance
      const loadContent = () => {
        const saved = localStorage.getItem(DSL_STORAGE_KEY);
        if (saved && saved.trim() !== '') {
          setDslContent(saved);
          setLastSaved(new Date());
        } else {
          // Si no hay contenido guardado, usar el valor inicial
          setDslContent(initialValue);
        }
        setIsInitialized(true);
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if (window.requestIdleCallback) {
        window.requestIdleCallback(loadContent);
      } else {
        setTimeout(loadContent, 0);
      }
    }
  }, [initialValue, isInitialized]);

  // Auto-save cuando cambie el contenido (solo si no hay errores)
  useEffect(() => {
    if (dslContent === initialValue) return; // No guardar el valor inicial
    if (hasErrors) return; // No guardar si hay errores

    const timeoutId = setTimeout(() => {
      saveToStorage(dslContent);
    }, DSL_AUTO_SAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [dslContent, initialValue, saveToStorage, hasErrors]);

  const updateDslContent = useCallback((newContent: string) => {
    setDslContent(newContent);
  }, []);

  const clearSavedDsl = useCallback(() => {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(DSL_STORAGE_KEY);
      setDslContent(initialValue);
      setLastSaved(null);
      setHasUnsavedChanges(false);
    }
  }, [initialValue]);

  // Actualizar estado de cambios no guardados
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage) {
      const saved = localStorage.getItem(DSL_STORAGE_KEY);
      setHasUnsavedChanges(saved !== dslContent);
    }
  }, [dslContent]);

  return {
    dslContent: isInitialized ? dslContent : initialValue,
    updateDslContent,
    clearSavedDsl,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges,
    isInitialized,
  };
}
