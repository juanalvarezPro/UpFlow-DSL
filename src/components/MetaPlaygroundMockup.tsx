'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { X, MoreVertical, ArrowRight, Smartphone, Play, Pause, RotateCcw, Code } from 'lucide-react';
import { toast } from 'sonner';

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

  // Procesar datos del DSL para crear un preview funcional
  const processedData = useMemo(() => {
    // Si hay un error o el DSL no es válido, retornar null para mostrar estado de error
    if (error || !isValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!dslData || !(dslData as any).screens || (dslData as any).screens.length === 0) {
      return {
        screens: [
          {
            id: "cita",
            title: "Agendamiento de CITA",
            layout: {
              type: "SingleColumnLayout",
              children: [
                { type: "TextSubheading", text: "Este es el titulo de cita" },
                { type: "TextBody", text: "Selecciona el tipo de cita que necesitas" },
                {
                  type: "Form",
                  name: "form_agendamiento",
                  children: [
                    {
                      type: "Dropdown",
                      label: "Seleccione tipo cita",
                      name: "tipo_cita",
                      required: true,
                      "data-source": "${data.tipo_cita}"
                    },
                    {
                      type: "Dropdown", 
                      label: "Seleccione fecha",
                      name: "fecha",
                      required: true,
                      "data-source": "${data.fecha}"
                    },
                    {
                      type: "Footer",
                      label: "Continuar",
                      "on-click-action": {
                        name: "navigate",
                        next: { type: "screen", name: "confirmacion" }
                      }
                    }
                  ]
                }
              ]
            },
            data: {
              tipo_cita: {
                "__example__": [
                  { id: "general", title: "Consulta General" },
                  { id: "especializada", title: "Consulta Especializada" },
                  { id: "laboratorio", title: "Examen de Laboratorio" },
                  { id: "control_salud", title: "Control de Salud Preventivo" }
                ]
              },
              fecha: {
                "__example__": [
                  { id: "2027_01_01", title: "Lunes, Ene 01 2027" },
                  { id: "2027_01_02", title: "Martes, Ene 02 2027" },
                  { id: "2027_01_03", title: "Miércoles, Ene 03 2027" }
                ]
              }
            }
          }
        ]
      };
    }

    // Procesar datos reales del DSL
    return {
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
          {!error && isValid && processedData && (
            <div className="text-xs text-blue-200">
              {currentScreenIndex + 1} de {processedData.screens.length}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyJSONToClipboard}
            className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-2"
            title={copied ? "Copiado listo" : "Copiar código"}
          >
            <Code className="h-4 w-4" />
            <span className="text-xs">
              {copied ? "Copiado listo" : "Copiar código"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPreview}
            className="text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="glass-subtle rounded-lg px-3 py-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium text-white">WhatsApp Business</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 flex justify-center relative z-10">
        <div className="w-full max-w-sm">
          {/* Estado de error - Skeleton con pulse */}
          {error || !isValid ? (
            <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-pulse flex flex-col min-h-[500px]">
              {/* Header skeleton */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-slate-500 rounded"></div>
                  <div className="h-4 w-32 bg-slate-500 rounded"></div>
                </div>
                <div className="h-5 w-5 bg-slate-500 rounded"></div>
              </div>

              {/* Content skeleton */}
              <div className="flex-1 p-4 space-y-4">
                {/* Title skeleton */}
                <div className="h-6 w-48 bg-slate-600 rounded mx-auto"></div>
                
                {/* Text skeleton */}
                <div className="h-4 w-64 bg-slate-600 rounded mx-auto"></div>
                
                {/* Image placeholder skeleton */}
                <div className="w-full h-48 bg-slate-600 rounded-lg"></div>
                
                {/* Navigation text skeleton */}
                <div className="h-4 w-40 bg-slate-600 rounded mx-auto"></div>
                
                {/* Form skeleton */}
                <div className="space-y-4">
                  {/* Label skeleton */}
                  <div className="h-4 w-32 bg-slate-600 rounded"></div>
                  
                  {/* Dropdown skeleton */}
                  <div className="h-12 w-full bg-slate-600 rounded-lg"></div>
                  
                  {/* Label skeleton */}
                  <div className="h-4 w-28 bg-slate-600 rounded"></div>
                  
                  {/* Dropdown skeleton */}
                  <div className="h-12 w-full bg-slate-600 rounded-lg"></div>
                  
                  {/* Button skeleton */}
                  <div className="h-12 w-full bg-slate-600 rounded-lg"></div>
                </div>
              </div>

              {/* Footer skeleton - Altura fija */}
              <div className="px-4 py-3 bg-slate-600/20 border-t border-slate-500/20 flex-shrink-0 h-16 flex items-center justify-center">
                <div className="h-3 w-48 bg-slate-600 rounded mx-auto"></div>
              </div>
            </div>
          ) : (
            /* Mockup glassmorphism coherente con el proyecto */
            <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
            {/* Header de WhatsApp */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-white" />
                <h2 className="font-semibold text-white">{currentScreen.title}</h2>
              </div>
              <MoreVertical className="h-5 w-5 text-white" />
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto bg-slate-50/10 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {/* Contenido de texto */}
                {currentScreen.layout?.children?.map((child: DSLChild, index: number) => {
                  if (child.type === "TextSubheading") {
                    return (
                      <h1 key={index} className="text-lg font-semibold text-white text-center">
                        {child.text}
                      </h1>
                    );
                  }
                  if (child.type === "TextBody") {
                    return (
                      <p key={index} className="text-sm text-blue-100 text-center">
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
                    return (
                      <div key={index} className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center overflow-hidden border border-blue-500/20">
                          <img 
                            src={child.src} 
                            alt="Imagen"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
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
                                  {options.map((option: { id: string; title: string }, optIndex: number) => (
                                    <option key={optIndex} value={option.id}>
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
        <div className="flex justify-center mt-4 space-x-2 relative z-10">
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
