'use client';

import { useState, useCallback, useMemo } from 'react';
import { parse, SyntaxError } from '@/lib/parser';
import { DEFAULT_DSL } from '@/constants/defaultDSL';

interface ParseResult {
  success: boolean;
  data?: {
    version: string;
    screens: Array<{
      id: string;
      title: string;
      layout: {
        type: string;
        children: Array<{
          type: string;
          text?: string;
          items?: Array<{
            id: string;
            title: string;
          }>;
        }>;
      };
    }>;
  };
  error?: {
    message: string;
    location: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
  };
}

const DEFAULT_DSL_VALUE = DEFAULT_DSL;

export function useDSLEditor() {
  const [dslValue, setDSLValue] = useState(DEFAULT_DSL_VALUE);

  const parseResult = useMemo((): ParseResult => {
    if (!dslValue.trim()) {
      return {
        success: false,
        error: {
          message: 'El DSL está vacío',
          location: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 1 }
          }
        }
      };
    }

    try {
      // Detectar si hay múltiples pantallas
      const screenCount = (dslValue.match(/Pantalla\s+\w+:/g) || []).length;

      let result;
      if (screenCount > 1) {
        // Si hay múltiples pantallas, usar la regla Flow
        result = parse(dslValue, {}) as ParseResult['data'];
      } else {
        // Si hay una sola pantalla, usar SingleScreen
        result = parse(dslValue, { startRule: 'SingleScreen' }) as ParseResult['data'];
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: {
            message: error.message,
            location: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 }
            }
          }
        };
      }
      return {
        success: false,
        error: {
          message: 'Error inesperado al parsear el DSL',
          location: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 1 }
          }
        }
      };
    }
  }, [dslValue]);

  const handleDSLChange = useCallback((newValue: string) => {
    setDSLValue(newValue);
  }, []);

  const handleFormat = useCallback(() => {
    // Función simple de formateo
    const formatted = dslValue
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    setDSLValue(formatted);
  }, [dslValue]);

  return {
    dslValue,
    setDSLValue,
    handleDSLChange,
    handleFormat,
    parseResult,
    isValid: parseResult.success,
    jsonData: parseResult.success ? parseResult.data : null,
    error: parseResult.success ? null : parseResult.error
  };
}
