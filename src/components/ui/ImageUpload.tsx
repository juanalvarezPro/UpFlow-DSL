'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { toast } from 'sonner';
import { useR2ImageManager } from '@/hooks/useR2ImageManager';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onCancel: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onCancel }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [r2Url, setR2Url] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveImage } = useR2ImageManager();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar formato (solo PNG y JPEG)
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Solo se permiten archivos PNG y JPEG');
        return;
      }

      // Validar tamaño (máximo 300KB)
      if (file.size > 300 * 1024) {
        toast.error('La imagen debe ser menor a 300KB');
        return;
      }

      // Mostrar preview inmediatamente del archivo local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsLoading(true);
      
      try {
        // Subir a R2
        const uploadedR2Url = await saveImage(file);
        setR2Url(uploadedR2Url);
      } catch (error) {
        console.error('Error uploading to R2:', error);
        toast.error('Error al subir la imagen');
        setPreview(null); // Limpiar preview si falla
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirm = () => {
    if (r2Url) {
      // Pasamos la URL de R2 (no la preview local)
      onImageUpload(r2Url);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setR2Url(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-xl p-6 max-w-md w-full mx-4 border border-blue-500/20">
        <h3 className="text-lg font-semibold mb-2 text-slate-200">Subir Imagen</h3>
        <p className="text-sm text-slate-400 mb-4">
          Coloca el cursor en tu editor donde quieres que se genere la imagen
        </p>
        
        {!preview ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center glass-subtle hover:border-blue-400/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer block"
              >
                <div className="text-blue-400 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-slate-300">
                  Haz clic para seleccionar una imagen
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPEG hasta 300KB
                </p>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-2">Vista previa:</p>
              <div className="border border-blue-500/20 rounded-lg p-2 inline-block glass-subtle relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={128}
                  className="max-h-32 max-w-full object-contain rounded"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                    <div className="text-white text-sm flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subiendo...
                    </div>
                  </div>
                )}
              </div>
              {r2Url && !isLoading && (
                <p className="text-xs text-green-400 mt-2">✅ Imagen subida correctamente</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-slate-300 hover:text-slate-100 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/30"
          >
            Cancelar
          </Button>
          {preview && r2Url && (
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/20 hover:border-blue-400/30"
            >
              {isLoading ? 'Procesando...' : 'Confirmar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
