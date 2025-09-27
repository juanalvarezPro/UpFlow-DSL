'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface R2ImageData {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
}

// Función para verificar si una URL es de R2
const isR2Url = (url: string): boolean => {
  return url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com') || url.includes('upflows');
};

export function useR2ImageManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Subir imagen a R2 via API
  const saveImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const result = await response.json();
      const imageData = result.data;
      
      toast.success('Imagen subida correctamente a R2');
      return imageData.url; // Retorna la URL de R2
    } catch (error) {
      console.error('Error uploading to R2:', error);
      toast.error('Error al subir la imagen a R2');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Obtener metadatos de imagen desde R2 (no necesitamos localStorage)
  const getImageData = useCallback((url: string): R2ImageData | null => {
    if (isR2Url(url)) {
      const urlParts = url.split('/');
      const id = urlParts[urlParts.length - 1]; // Última parte de la URL
      return {
        id,
        url,
        name: `Imagen ${id}`,
        size: 0,
        uploadedAt: new Date().toISOString(),
      };
    }
    return null;
  }, []);

  // Convertir URL de R2 a base64 (para el JSON final)
  const convertToBase64 = useCallback(async (url: string): Promise<string> => {
    if (!isR2Url(url)) {
      // Si no es URL de R2, asumir que ya es base64
      return url;
    }

    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/r2/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download image');
      }

      const result = await response.json();
      return result.data.base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      toast.error('Error al convertir imagen a base64');
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Eliminar imagen de R2
  const deleteImage = useCallback(async (url: string): Promise<void> => {
    if (!isR2Url(url)) {
      return;
    }
    // En el futuro se puede implementar eliminación real de R2
    toast.info('Eliminación no implementada aún');
  }, []);

  // Limpiar todas las imágenes de R2
  const clearAllImages = useCallback(async (): Promise<void> => {
    toast.info('Eliminación no implementada aún');
  }, []);


  return {
    saveImage,
    getImageData,
    convertToBase64,
    deleteImage,
    clearAllImages,
    isUploading,
    isDownloading,
    isR2Url,
  };
}
