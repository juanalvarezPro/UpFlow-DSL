'use client';

import { useState, useCallback, useMemo } from 'react';
// @ts-ignore: parser may not be a module, but we still want to import for runtime
import * as parserModule from '@/lib/parser';
const parse = parserModule.parse;
const SyntaxError = parserModule.SyntaxError;
import { DEFAULT_DSL } from '@/constants/defaultDSL';
import { createUserFriendlyError, formatErrorForDisplay } from '@/lib/errorHandler';

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
      // Usar la regla Flow que maneja tanto una pantalla como múltiples
      const result = parse(dslValue, {}) as ParseResult['data'];

      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        const userFriendlyError = createUserFriendlyError(error);
        return {
          success: false,
          error: {
            message: formatErrorForDisplay(userFriendlyError),
            location: {
              start: { 
                line: userFriendlyError.line, 
                column: userFriendlyError.column 
              },
              end: { 
                line: userFriendlyError.line, 
                column: userFriendlyError.column 
              }
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
