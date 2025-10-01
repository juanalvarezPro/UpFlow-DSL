import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { X, MoreVertical, ArrowRight } from 'lucide-react';
import type {
  DSLChild,
  FormChild,
  FormElementChild,
  MetaPlaygroundContentProps
} from './types';

/**
 * MetaPlaygroundContent component renders a WhatsApp-like interface for the meta playground
 * @param props - Component props
 * @returns JSX element representing the playground content
 */
export function MetaPlaygroundContent({
  currentScreen,
  isPlaying,
  formData,
  isFormComplete,
  onFormChange,
  onContinue,
}: MetaPlaygroundContentProps) {
  // Memoize form children to avoid unnecessary re-renders
  const formChildren = useMemo(() => {
    const formChild = currentScreen.layout?.children?.find(
      (child: DSLChild): child is FormChild => child.type === "Form"
    );
    return formChild?.children || [];
  }, [currentScreen.layout?.children]);

  // Memoize dropdown options to avoid recalculating on every render
  const dropdownOptions = useMemo(() => {
    const optionsMap = new Map<string, { id: string; title: string; enabled?: boolean }[]>();
    
    formChildren.forEach((formChild: FormElementChild) => {
      if (formChild.type === "Dropdown") {
        const dataSource = formChild["data-source"];
        const dataKey = dataSource?.replace("${data.", "").replace("}", "");
        const options = currentScreen.data?.[dataKey]?.["__example__"] || [];
        optionsMap.set(formChild.name, options);
      }
    });
    
    return optionsMap;
  }, [formChildren, currentScreen.data]);

  // Optimized form change handler
  const handleFormChange = useCallback((name: string, value: string) => {
    onFormChange(name, value);
  }, [onFormChange]);

  // Optimized continue handler
  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  return (
    <div className={`glass rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full ${isPlaying ? 'ring-2 ring-blue-400/50' : ''}`}>
      {/* Header de WhatsApp */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <X className="h-5 w-5 text-white" />
          <h2 className="text-base font-semibold text-white">{currentScreen.title}</h2>
          {isPlaying && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200 font-medium">Ejecutando</span>
            </div>
          )}
        </div>
        <MoreVertical className="h-5 w-5 text-white" />
      </div>

      {/* Contenido con scroll mejorado */}
      <div className="flex-1 overflow-y-auto bg-slate-50/10 backdrop-blur-sm">
        <div className="p-4 space-y-4 pb-6">
          {/* Contenido de texto */}
          {currentScreen.layout?.children?.map((child: DSLChild, index: number) => {
            if (child.type === "TextSubheading") {
              return (
                <h1 key={index} className="text-xl font-bold text-white text-center mb-3">
                  {child.text}
                </h1>
              );
            }
            if (child.type === "TextBody") {
              return (
                <p key={index} className="text-sm text-slate-100 text-center leading-relaxed mb-3">
                  {child.text}
                </p>
              );
            }
            // Agregar texto de navegación si existe
            if ('text' in child && child.text && typeof child.text === 'string' && child.text.includes("Ir a pantalla")) {
              return (
                <p key={index} className="text-sm text-blue-200 text-center font-medium">
                  {child.text}
                </p>
              );
            }
            if (child.type === "Image") {
              // Debug: Log para verificar los valores de la imagen
              console.log('Imagen child:', child);
              console.log('Width:', child.width, 'Height:', child.height);

              return (
                <div key={index} className="relative">
                  <div
                    className="bg-gradient-to-br from-blue-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center overflow-hidden border border-blue-500/20"
                    style={{
                      width: child.width ? `${child.width}px` : '100%',
                      height: child.height ? `${child.height}px` : '160px'
                    }}
                  >
                    <Image
                      src={child.src}
                      width={child.width || 400}
                      height={child.height || 160}
                      alt="Imagen del flow"
                      className="rounded-lg"
                      style={{
                        width: child.width ? `${child.width}px` : 'auto',
                        height: child.height ? `${child.height}px` : 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        // Mostrar placeholder cuando falla la imagen
                        const placeholder = e.currentTarget.parentElement;
                        if (placeholder) {
                          placeholder.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-blue-300 text-sm">
                              <svg class="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span>Imagen no disponible</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Formulario interactivo */}
          <div className="space-y-4">
            {/* Dropdowns del formulario */}
            {formChildren.map((formChild: FormElementChild, index: number) => {
              if (formChild.type === "Dropdown") {
                const options = dropdownOptions.get(formChild.name) || [];

                return (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      {formChild.label}
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-3 text-sm bg-white/40 backdrop-blur-md border border-blue-400/30 rounded-lg text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-transparent shadow-lg"
                        value={formData[formChild.name] || ""}
                        onChange={(e) => handleFormChange(formChild.name, e.target.value)}
                      >
                        <option value="">Seleccionar...</option>
                        {options.map((option: { id: string; title: string; enabled?: boolean }, optIndex: number) => (
                          <option
                            key={optIndex}
                            value={option.id}
                            disabled={option.enabled === false}
                            style={option.enabled === false ? { color: '#9ca3af', fontStyle: 'italic' } : {}}
                          >
                            {option.title}
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {/* Botón Continuar - siempre visible */}
            <div className="pt-2">
              <Button
                onClick={handleContinue}
                disabled={!isFormComplete}
                className={`w-full py-3 text-base rounded-lg font-medium transition-all duration-200 ${isFormComplete
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Altura fija */}
      <div className="px-4 py-3 bg-slate-50/10 backdrop-blur-md border-t border-blue-500/20 flex-shrink-0 h-16 flex items-center justify-center">
        <p className="text-xs text-white text-center">
          Administrado por la empresa.{' '}
          <span className="text-blue-300 font-medium">Más información</span>
        </p>
      </div>
    </div>
  );
}
