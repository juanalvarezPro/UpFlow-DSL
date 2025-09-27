'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { X, MoreVertical, ArrowRight, Smartphone, Play, Pause, RotateCcw, Code, Download, Loader2, ChevronDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface MetaPlaygroundMockupProps {
  dslData?: unknown;
  error?: string | null;
  isValid?: boolean;
}

interface FormData {
  [key: string]: string;
}

// Interfaces para los diferentes tipos de elementos del DSL
interface BaseChild {
  type: string;
}

interface TextSubheadingChild extends BaseChild {
  type: "TextSubheading";
  text: string;
}

interface TextBodyChild extends BaseChild {
  type: "TextBody";
  text: string;
}

interface ImageChild extends BaseChild {
  type: "Image";
  src: string;
  width?: number;
  height?: number;
}

interface FormChild extends BaseChild {
  type: "Form";
  name: string;
  children: FormElementChild[];
}

interface DropdownChild extends BaseChild {
  type: "Dropdown";
  label: string;
  name: string;
  required: boolean;
  "data-source": string;
}

interface FooterChild extends BaseChild {
  type: "Footer";
  label: string;
  "on-click-action": {
    name: string;
    next: {
      type: string;
      name: string;
    };
  };
}

type FormElementChild = DropdownChild | FooterChild;
type DSLChild = TextSubheadingChild | TextBodyChild | ImageChild | FormChild;

export function MetaPlaygroundMockup({ dslData, error, isValid = true }: MetaPlaygroundMockupProps) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showScreenOptions, setShowScreenOptions] = useState(false);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowScreenOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Procesar datos del DSL para crear un preview funcional
  const processedData = useMemo(() => {
    // Si hay un error o el DSL no es válido, retornar null para mostrar estado de error
    if (error || !isValid) {
      return null;
    }

    // Si no hay datos del DSL, retornar null para mostrar estado vacío
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!dslData || !(dslData as any).screens || (dslData as any).screens.length === 0) {
      return null;
    }

    // Procesar datos reales del DSL
    const processed = {
      ...dslData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screens: (dslData as any).screens.map((screen: any) => ({
        ...screen,
        // Asegurar que el layout tenga la estructura correcta
        layout: screen.layout || {
          type: "SingleColumnLayout",
          children: []
        }
      }))
    };
    
    // Debug: Log para verificar que el height se está pasando correctamente
    console.log('DSL Data recibido:', dslData);
    console.log('Processed Data:', processed);
    
    return processed;
  }, [dslData, error, isValid]);

  const currentScreen = processedData?.screens?.[currentScreenIndex];

  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    // Buscar el botón Footer en el formulario actual para obtener la acción de navegación
    const form = currentScreen?.layout?.children?.find((child: DSLChild): child is FormChild => child.type === "Form");
    const footerButton = form?.children?.find((child: FormElementChild): child is FooterChild => child.type === "Footer");
    
    if (footerButton?.["on-click-action"]?.next?.name) {
      const nextScreenName = footerButton["on-click-action"].next.name;
      const nextScreenIndex = processedData?.screens.findIndex((screen: { id: string }) => screen.id === nextScreenName);
      
      if (nextScreenIndex !== -1) {
        setCurrentScreenIndex(nextScreenIndex);
        setFormData({}); // Limpiar formulario al cambiar de pantalla
      } else {
        // Si no encuentra la pantalla, mostrar mensaje de éxito
        alert('¡Flow completado exitosamente!');
      }
    } else {
      // Si no hay navegación definida, ir a la siguiente pantalla secuencial
      if (currentScreenIndex < (processedData?.screens.length ?? 0) - 1) {
        setCurrentScreenIndex(prev => prev + 1);
        setFormData({}); // Limpiar formulario al cambiar de pantalla
      } else {
        // Si es la última pantalla, mostrar mensaje de éxito
        toast.success('¡Flow completado exitosamente!');
      }
    }
  };

  const resetPreview = () => {
    setCurrentScreenIndex(0);
    setFormData({});
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const generateJSON = () => {
    if (!processedData) return '';
    return JSON.stringify(processedData, null, 2);
  };


  const copyJSONToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateJSON());
      setCopied(true);
      // Resetear el estado después de 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar JSON:', err);
    }
  };

  const handleExport = async () => {
    if (!processedData) return;
    
    setIsExporting(true);
    try {
      const jsonData = generateJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upflows-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar JSON:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Verificar si el formulario está completo
  const isFormComplete = useMemo(() => {
    if (!currentScreen) return false;
    
    const form = currentScreen.layout?.children?.find((child: DSLChild): child is FormChild => child.type === "Form");
    if (!form) return true;
    
    const requiredFields = form.children?.filter((child: FormElementChild): child is DropdownChild => 
      child.type === "Dropdown" && child.required
    ) || [];
    
    return requiredFields.every((field: DropdownChild) => formData[field.name]);
  }, [currentScreen, formData]);

  return (
    <div className="h-full bg-blue-blur flex flex-col relative overflow-hidden">
      {/* Efectos de fondo glassmorphism coherentes con el proyecto */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header del Preview */}
      <div className="glass-strong border-b border-blue-500/20 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shadow-lg ${
            error || !isValid 
              ? 'bg-red-400 shadow-red-400/50' 
              : 'bg-blue-400 shadow-blue-400/50'
          }`}></div>
          <div className="text-white text-sm font-medium">
            {error || !isValid ? 'Error en el DSL' : 'Vista Previa Interactiva'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botones de control */}
          {!error && isValid && processedData && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
                title={isPlaying ? "Pausar" : "Ejecutar"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetPreview}
                className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
                title="Reiniciar"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Botón de opciones de pantallas */}
          {!error && isValid && processedData && processedData.screens.length > 1 && (
            <div className="relative dropdown-container">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScreenOptions(!showScreenOptions)}
                className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-2"
                title="Seleccionar pantalla"
              >
                <span className="text-xs">
                  {processedData.screens[currentScreenIndex]?.title || `Pantalla ${currentScreenIndex + 1}`}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showScreenOptions && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-2xl z-[100]">
                  <div className="p-2">
                    <div className="text-xs text-blue-300 mb-2 px-2 font-medium">Seleccionar pantalla:</div>
                    {processedData.screens.map((screen: { id: string; title: string }, index: number) => (
                      <button
                        key={screen.id}
                        onClick={() => {
                          setCurrentScreenIndex(index);
                          setShowScreenOptions(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          index === currentScreenIndex
                            ? 'bg-blue-600/40 text-white border border-blue-500/30'
                            : 'text-slate-200 hover:text-white hover:bg-blue-500/20 border border-transparent'
                        }`}
                      >
                        <div className="font-medium">{screen.title}</div>
                        <div className="text-xs text-blue-300">Pantalla {index + 1}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Botones de opciones */}
          {!error && isValid && processedData && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyJSONToClipboard}
                className={`border border-blue-500/20 ${
                  copied 
                    ? 'text-green-400 bg-green-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-blue-500/20'
                }`}
                title={copied ? "¡Copiado!" : "Copiar código"}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || !processedData}
                className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 disabled:opacity-50"
                title="Exportar"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
          
          <div className="glass-subtle rounded-lg px-3 py-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium text-white">WhatsApp Business</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 flex justify-center relative z-0 overflow-hidden">
        <div className="w-full max-w-sm h-full flex flex-col">
          {/* Estado de error o sin datos */}
          {error || !isValid || !processedData ? (
            <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
              {/* Header de error */}
              <div className={`px-4 py-3 flex items-center justify-between flex-shrink-0 ${
                error || !isValid 
                  ? 'bg-gradient-to-r from-red-600 to-red-700' 
                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
              }`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-white" />
                  <h2 className="font-semibold text-white">
                    {error || !isValid ? 'Error en el DSL' : 'DSL vacío'}
                  </h2>
                </div>
                <X className="h-5 w-5 text-white" />
              </div>

              {/* Contenido de error o sin datos */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
                {/* Icono de error grande */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  error || !isValid 
                    ? 'bg-red-500/20' 
                    : 'bg-slate-500/20'
                }`}>
                  <AlertTriangle className={`h-10 w-10 ${
                    error || !isValid 
                      ? 'text-red-400' 
                      : 'text-slate-400'
                  }`} />
                </div>
                
                {/* Mensaje principal */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    {error || !isValid ? '¡Ups! Te equivocaste!' : 'El DSL está vacío'}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {error || !isValid 
                      ? 'Revisa en nuestro compilador de sintaxis natural.'
                      : 'Comienza escribiendo tu código DSL en el editor para ver la vista previa aquí.'
                    }
                  </p>
                </div>
                
                {/* Detalles del error */}
                {error && (
                  <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-300 mb-2">
                          🔍 Error
                        </p>
                          <p className="text-sm text-red-200/90 break-words font-mono leading-relaxed">
                            {error}
                          </p>
                        <p className="text-xs text-red-300/70 mt-2">
                          💡 Este es el error exacto que encontró nuestro compilador de sintaxis natural
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Instrucciones */}
              </div>

              {/* Footer de error o sin datos */}
              <div className={`px-4 py-3 border-t flex-shrink-0 h-16 flex items-center justify-center ${
                error || !isValid 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-slate-500/10 border-slate-500/20'
              }`}>
                <p className={`text-xs text-center ${
                  error || !isValid 
                    ? 'text-red-300' 
                    : 'text-slate-300'
                }`}>
                  {error || !isValid 
                    ? 'Usa nuestro compilador de sintaxis natural para corregir el error'
                    : 'Escribe tu código DSL para ver la vista previa aquí'
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Mockup glassmorphism coherente con el proyecto */
            <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Header de WhatsApp */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-white" />
                <h2 className="font-semibold text-white">{currentScreen.title}</h2>
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
                  {currentScreen.layout?.children?.find((child: DSLChild): child is FormChild => child.type === "Form") && 
                    currentScreen.layout.children
                      .find((child: DSLChild): child is FormChild => child.type === "Form")
                      ?.children?.map((formChild: FormElementChild, index: number) => {
                        if (formChild.type === "Dropdown") {
                          const dataSource = formChild["data-source"];
                          const dataKey = dataSource?.replace("${data.", "").replace("}", "");
                          const options = currentScreen.data?.[dataKey]?.["__example__"] || [];
                          
                          return (
                            <div key={index} className="space-y-2">
                              <label className="text-sm font-medium text-white">
                                {formChild.label}
                              </label>
                              <div className="relative">
                                <select 
                                  className="w-full px-3 py-3 bg-white/40 backdrop-blur-md border border-blue-400/30 rounded-lg text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-transparent shadow-lg"
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
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                        isFormComplete 
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
          )}
        </div>
      </div>


      {/* Indicadores de navegación */}
      {!error && isValid && processedData && (
        <div className="flex justify-center mt-4 space-x-2 relative z-0">
          {processedData.screens.map((_: unknown, index: number) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentScreenIndex 
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                : 'bg-slate-400/60'
            }`}
          ></div>
        ))}
        </div>
      )}
    </div>
  );
}
