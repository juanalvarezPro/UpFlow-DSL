'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Loader2, Zap, Brain, Rocket } from 'lucide-react';

interface AIGeneratorProps {
  onGenerate?: (prompt: string) => void;
}

export function AIGenerator({ onGenerate }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simular generación con IA (por ahora)
    setTimeout(() => {
      setIsGenerating(false);
      if (onGenerate) {
        onGenerate(prompt);
      }
    }, 2000);
  };

  const examplePrompts = [
    "Crear un flow de agendamiento de citas médicas",
    "Generar un formulario de contacto para una empresa",
    "Crear un sistema de reservas de restaurante",
    "Flow de registro de usuarios con validación"
  ];

  return (
    <div className="glass rounded-xl p-6 border border-blue-500/20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Generador de Flows con IA</h3>
            <p className="text-sm text-slate-400">Describe el flow que necesitas y lo generaremos automáticamente</p>
          </div>
        </div>

        {/* Input de prompt */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el flow que quieres crear... Ejemplo: 'Crear un sistema de agendamiento de citas médicas con selección de especialidad, fecha y hora'"
              className="w-full h-24 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isGenerating}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {prompt.length}/500
            </div>
          </div>

          {/* Botón de generación */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              isGenerating || !prompt.trim()
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando con IA...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Flow
              </>
            )}
          </Button>
        </div>

        {/* Estado de desarrollo */}
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">🚧 En Desarrollo</span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1">
            Esta funcionalidad está siendo desarrollada. Pronto podrás generar flows completos usando inteligencia artificial.
          </p>
        </div>

        {/* Ejemplos de prompts */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Ejemplos de prompts:</h4>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                disabled={isGenerating}
                className="w-full text-left p-3 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 rounded-lg text-sm text-slate-300 hover:text-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="h-3 w-3 text-blue-400" />
                  {example}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-300 font-medium">¿Cómo funciona?</p>
              <p className="text-xs text-blue-300/80 mt-1">
                Describe tu flow en lenguaje natural y nuestra IA lo convertirá automáticamente en código DSL válido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
