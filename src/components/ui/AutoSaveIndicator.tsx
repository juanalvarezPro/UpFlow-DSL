'use client';

import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export function AutoSaveIndicator({ isAutoSaving, lastSaved, hasUnsavedChanges }: AutoSaveIndicatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar hidratación inconsistente mostrando estado neutral hasta que se monte
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>Sin cambios</span>
      </div>
    );
  }
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    return date.toLocaleDateString();
  };

  if (isAutoSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-blue-400">
        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Guardando...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center gap-2 text-xs text-yellow-400">
        <AlertCircle className="w-3 h-3" />
        <span>Cambios sin guardar</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400">
        <Check className="w-3 h-3" />
        <span>Guardado {formatLastSaved(lastSaved)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <Clock className="w-3 h-3" />
      <span>Sin cambios</span>
    </div>
  );
}
