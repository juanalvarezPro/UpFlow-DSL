'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
// @ts-expect-error: parser may not be a module, but we still want to import for runtime
import * as parserModule from '@/lib/parser';
const parse = parserModule.parse;
const SyntaxError = parserModule.SyntaxError;
import { DEFAULT_DSL } from '@/constants/defaultDSL';
import { validateDSL, ValidationWarning } from '@/lib/validation';
import { useDSLPersistence } from './useDSLPersistence';



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
  warnings?: ValidationWarning[];
}

const DEFAULT_DSL_VALUE = DEFAULT_DSL;

export function useDSLEditor() {
  const { dslContent, updateDslContent, isAutoSaving, lastSaved, hasUnsavedChanges } = useDSLPersistence(DEFAULT_DSL_VALUE);
  const [dslValue, setDSLValue] = useState(dslContent);

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

    // Validate DSL content first
    const validationResult = validateDSL(dslValue);

    try {
      // Pre-procesar el DSL para eliminar comentarios
      const processedDSL = dslValue
        .split('\n')
        .map(line => line.trim().startsWith('//') ? '' : line)
        .join('\n');
      
      // Usar la regla Flow que maneja tanto una pantalla como múltiples
      const result = parse(processedDSL, {}) as ParseResult['data'];

      return {
        success: true,
        data: result,
        warnings: validationResult.warnings.length > 0 ? validationResult.warnings : undefined
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        const syntaxError = error as SyntaxError & {
          location?: {
            start?: { line?: number; column?: number };
            end?: { line?: number; column?: number };
          };
        };
        return {
          success: false,
          error: {
            message: syntaxError.message,
            location: {
              start: { 
                line: syntaxError.location?.start?.line || 1, 
                column: syntaxError.location?.start?.column || 1 
              },
              end: { 
                line: syntaxError.location?.end?.line || 1, 
                column: syntaxError.location?.end?.column || 1 
              }
            }
          },
          warnings: validationResult.warnings.length > 0 ? validationResult.warnings : undefined
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
        },
        warnings: validationResult.warnings.length > 0 ? validationResult.warnings : undefined
      };
    }
  }, [dslValue]);

  // Sincronizar con el contenido persistido
  useEffect(() => {
    setDSLValue(dslContent);
  }, [dslContent]);

  const handleDSLChange = useCallback((newValue: string) => {
    setDSLValue(newValue);
    updateDslContent(newValue);
  }, [updateDslContent]);

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
    error: parseResult.success ? null : parseResult.error,
    warnings: parseResult.warnings,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges
  };
}
