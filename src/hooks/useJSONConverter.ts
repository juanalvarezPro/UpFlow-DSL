'use client';

import { useCallback } from 'react';
import { useR2ImageManager } from './useR2ImageManager';
import { R2_CONFIG } from '@/lib/r2-config';

// Función para verificar si una URL es de R2
const isR2Url = (url: string): boolean => {
  return url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com') || url.includes('upflows');
};

export function useJSONConverter() {
  const { convertToBase64 } = useR2ImageManager();

  // Función recursiva para convertir URLs de R2 a base64 en el JSON
  const convertR2UrlsToBase64 = useCallback(async (obj: unknown): Promise<unknown> => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      // Si es una URL de R2, convertir a base64
      if (isR2Url(obj)) {
        try {
          // Primero convertir URL del endpoint R2 al dominio público si está configurado
          let urlToConvert = obj;
          if (R2_CONFIG.publicDomain && obj.includes(R2_CONFIG.endpoint) && obj.includes(R2_CONFIG.bucketName)) {
            // Extraer la key (temp/image_id)
            const urlParts = obj.split('/');
            const key = urlParts.slice(-2).join('/'); // temp/image_id
            urlToConvert = `${R2_CONFIG.publicDomain}/${key}`;
          }
          
          const base64 = await convertToBase64(urlToConvert);
          return base64;
        } catch (error) {
          console.error('Error converting R2 URL to base64:', error);
          return obj; // Retornar URL original si falla la conversión
        }
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      const convertedArray = await Promise.all(
        obj.map(item => convertR2UrlsToBase64(item))
      );
      return convertedArray;
    }

    if (typeof obj === 'object') {
      const convertedObj: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        convertedObj[key] = await convertR2UrlsToBase64(value);
      }
      return convertedObj;
    }

    return obj;
  }, [convertToBase64]);

  return {
    convertR2UrlsToBase64,
  };
}
