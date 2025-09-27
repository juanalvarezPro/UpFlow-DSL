'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronRight, ChevronDown, BookOpen, Code, Eye, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface GettingStartedAsideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GettingStartedAside({ isOpen, onClose }: GettingStartedAsideProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basics']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: 'basics',
      title: 'Conceptos Básicos',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">¿Qué es UpFlows! DSL?</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Un lenguaje simple para crear flujos de conversación de WhatsApp Business 
              sin necesidad de programar. Escribe en sintaxis natural y obtén JSON listo para Meta.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Flujo de trabajo</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>1. Escribe tu DSL en el editor</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>2. Ve la vista previa en tiempo real</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>3. Copia el JSON generado</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>4. Importa en Meta Business Manager</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'syntax',
      title: 'Sintaxis DSL',
      icon: Code,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Keywords principales</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">Pantalla</code>
                <span>Define una nueva pantalla</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <code className="bg-slate-800 px-2 py-1 rounded text-green-300">Titulo</code>
                <span>Agrega un título</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">Lista</code>
                <span>Crea opciones desplegables</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <code className="bg-slate-800 px-2 py-1 rounded text-orange-300">Mostramos</code>
                <span>Contenido principal</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <code className="bg-slate-800 px-2 py-1 rounded text-red-300">Ir a pantalla</code>
                <span>Navegación entre pantallas</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Ejemplo básico</h4>
            <div className="bg-slate-900/50 rounded-lg p-3 text-xs font-mono text-slate-300">
              <div className="text-blue-300">Pantalla "Bienvenida":</div>
              <div className="text-green-300 ml-2">Titulo: ¡Hola!</div>
              <div className="text-orange-300 ml-2">Mostramos: Bienvenido a nuestra app</div>
              <div className="text-purple-300 ml-2">Lista "Opciones":</div>
              <div className="text-slate-300 ml-4">1. cita - Agendar cita</div>
              <div className="text-slate-300 ml-4">2. info - Ver información</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preview',
      title: 'Vista Previa',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Panel de vista previa</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              El panel derecho muestra cómo se verá tu flow en WhatsApp Business. 
              Cambia entre vista previa y JSON usando los botones en la parte superior.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Características</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Actualización en tiempo real</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Simulación de WhatsApp Business</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Navegación entre pantallas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Interacciones realistas</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Tips y Trucos',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Mejores prácticas</h4>
            <div className="space-y-3">
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="text-sm font-medium text-green-300 mb-1">✅ Haz esto</div>
                <div className="text-xs text-slate-300">
                  Usa nombres descriptivos para pantallas y listas. 
                  Mantén el contenido claro y conciso.
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="text-sm font-medium text-red-300 mb-1">❌ Evita esto</div>
                <div className="text-xs text-slate-300">
                  Nombres genéricos como &quot;Pantalla1&quot;. 
                  Textos muy largos o confusos.
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200">Atajos útiles</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Hover sobre keywords</span>
                <span className="text-blue-300">Ver tooltips</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl + Space</span>
                <span className="text-blue-300">Autocompletado</span>
              </div>
              <div className="flex justify-between">
                <span>Botón Imagen</span>
                <span className="text-blue-300">Subir imágenes</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex">
      {/* Overlay */}
      <div className="flex-1" onClick={onClose}></div>
      
      {/* Aside */}
      <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">Getting Started</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200"
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Guía completa para empezar con UpFlows! DSL
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id} className="border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-slate-200">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-700">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">¿Necesitas ayuda?</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Hover sobre cualquier keyword en el editor para ver ejemplos y sintaxis.
            </p>
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onClose}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Empezar a crear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
