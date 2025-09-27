'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Play, SkipForward } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setShowVideo(true);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h1 className="text-xl font-bold text-slate-800">¡Bienvenido a UpFlows! DSL</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showVideo ? (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Crea Flows de WhatsApp Meta con sintaxis natural
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                  UpFlows! DSL te permite crear flujos de conversación para WhatsApp Business 
                  usando un lenguaje simple y natural. Sin código, sin complicaciones.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Escribe en DSL</h3>
                  <p className="text-sm text-slate-600">
                    Usa sintaxis natural para definir pantallas, listas y navegación
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">👀</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Vista Previa</h3>
                  <p className="text-sm text-slate-600">
                    Ve cómo se verá tu flow en WhatsApp Business en tiempo real
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Exporta JSON</h3>
                  <p className="text-sm text-slate-600">
                    Genera el JSON listo para usar en Meta Business Manager
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handlePlayVideo}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Ver video explicativo
                </Button>
                <div>
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Saltar introducción
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                {isPlaying ? (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <p className="text-slate-600 font-medium">Reproduciendo video explicativo...</p>
                    <p className="text-sm text-slate-500">
                      Aquí iría el video real explicando cómo usar la plataforma
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <Play className="h-8 w-8 text-slate-600 ml-1" />
                    </div>
                    <p className="text-slate-600 font-medium">Video explicativo</p>
                    <p className="text-sm text-slate-500">
                      Haz clic en reproducir para ver el tutorial
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowVideo(false)}
                  className="text-slate-600"
                >
                  ← Volver
                </Button>
                <Button
                  onClick={handleSkip}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Comenzar a usar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
