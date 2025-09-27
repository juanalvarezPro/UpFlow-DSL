'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { R2_CONFIG } from '@/lib/r2-config';

// Función para verificar si una URL es de R2
const isR2Url = (url: string): boolean => {
  return url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com') || url.includes('upflows');
};

interface ImageTooltipProps {
  url: string;
  children: React.ReactNode;
  maxWidth?: number;
  maxHeight?: number;
}

export function ImageTooltip({ 
  url, 
  children, 
  maxWidth = 200, 
  maxHeight = 200 
}: ImageTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para convertir base64 a URL de imagen
  const getImageUrl = (url: string): string => {
    // Si es una URL de R2 directa (como pub-xxx.r2.dev), usar directamente
    if (isR2Url(url)) {
      return url;
    }
    
    // Convertir URL de R2 endpoint a dominio público si está configurado
    if (R2_CONFIG.publicDomain && url.includes(R2_CONFIG.endpoint) && url.includes(R2_CONFIG.bucketName)) {
      // Extraer la key (temp/image_id)
      const urlParts = url.split('/');
      const key = urlParts.slice(-2).join('/'); // temp/image_id
      return `${R2_CONFIG.publicDomain}/${key}`;
    }
    
    // Si es base64 puro, agregar prefijo
    if (url.match(/^[A-Za-z0-9+/]*={0,2}$/) && url.length > 100) {
      return `data:image/png;base64,${url}`;
    }
    
    // Si ya tiene prefijo data:, usar directamente
    if (url.startsWith('data:image/')) {
      return url;
    }
    
    return url;
  };

  // Calcular posición del tooltip
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      let x = rect.left + rect.width / 2;
      let y = rect.top - 10;
      
      // Ajustar si se sale por la derecha
      if (x + maxWidth / 2 > viewportWidth) {
        x = viewportWidth - maxWidth / 2 - 10;
      }
      
      // Ajustar si se sale por la izquierda
      if (x - maxWidth / 2 < 0) {
        x = maxWidth / 2 + 10;
      }
      
      // Ajustar si se sale por arriba
      if (y - maxHeight - 10 < 0) {
        y = rect.bottom + 10;
      }
      
      setPosition({ x, y });
    }
  }, [maxWidth, maxHeight]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible, maxWidth, maxHeight]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Preload image when tooltip becomes visible
  useEffect(() => {
    if (isVisible && !imageLoaded && !imageError) {
      const img = new Image();
      const imageUrl = getImageUrl(url);
      
      img.onload = () => {
        console.log('Preload successful:', imageUrl);
        setImageLoaded(true);
        setImageError(false);
      };
      
      img.onerror = () => {
        console.error('Preload failed:', imageUrl);
        setImageError(true);
        setImageLoaded(false);
      };
      
      img.src = imageUrl;
    }
  }, [isVisible, url, imageLoaded, imageError]);

  const handleMouseEnter = () => {
    const processedUrl = getImageUrl(url);
    console.log('ImageTooltip mouse enter - Original URL:', url, 'Processed URL:', processedUrl);
    console.log('Image states - loaded:', imageLoaded, 'error:', imageError);
    
    setIsVisible(true);
    setImageLoaded(false);
    setImageError(false);
    
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Timeout de 5 segundos para mostrar error si no carga (reducido para mejor UX)
    timeoutRef.current = setTimeout(() => {
      console.log('Image loading timeout for URL:', processedUrl);
      setImageError(true);
    }, 5000);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    
    // Limpiar timeout al salir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    console.log('Image loaded successfully:', getImageUrl(url), 'Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
    setImageLoaded(true);
    setImageError(false);
    
    // Limpiar timeout al cargar exitosamente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    console.error('Image failed to load:', getImageUrl(url), 'Error event:', e);
    console.error('Image src attempted:', img.src);
    setImageError(true);
    setImageLoaded(false);
    
    // Limpiar timeout al fallar
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer hover:text-blue-300 transition-colors duration-200"
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-2xl p-2 max-w-xs">
            {!imageLoaded && !imageError && (
              <div className="flex flex-col items-center justify-center w-48 h-32 bg-slate-700/50 rounded">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-2"></div>
                <div className="text-xs text-slate-400">Cargando imagen...</div>
              </div>
            )}
            
            {imageError && (
              <div className="flex flex-col items-center justify-center w-48 h-32 bg-slate-700/50 rounded text-slate-400 text-sm">
                <div className="text-center">
                  <div className="text-red-400 mb-1">⚠️</div>
                  <div>Error al cargar imagen</div>
                  <div className="text-xs mt-1 opacity-75">URL: {getImageUrl(url).substring(0, 30)}...</div>
                </div>
              </div>
            )}
            
            <img
              src={getImageUrl(url)}
              alt="Preview"
              className={`max-w-full max-h-full rounded object-contain ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
            />
            
            {/* Flecha del tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-600/50"></div>
          </div>
        </div>
      )}
    </>
  );
}
