import { DSLChild, ScreenData } from '@/components/playground/types';
import { useState, useMemo, useEffect } from 'react';

interface MetaPlaygroundState {
  currentScreenIndex: number;
  isPlaying: boolean;
  copied: boolean;
  isExporting: boolean;
  showScreenOptions: boolean;
  showMobileModal: boolean;
}

interface MetaPlaygroundActions {
  setCurrentScreenIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCopied: (copied: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  setShowScreenOptions: (show: boolean) => void;
  setShowMobileModal: (show: boolean) => void;
  togglePlay: () => void;
  resetPreview: () => void;
  copyJSONToClipboard: () => Promise<void>;
  handleExport: () => Promise<void>;
}

interface ProcessedData {
  screens: Array<{
    id: string;
    title: string;
    layout: {
      type: string;
      children: DSLChild[];
    };
    data?: ScreenData;
  }>;   
}

export function useMetaPlayground(
  dslData?: unknown,
  error?: string | null,
  isValid: boolean = true
): {
  state: MetaPlaygroundState;
  actions: MetaPlaygroundActions;
  processedData: ProcessedData | null;
  currentScreen: Screen;
} {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showScreenOptions, setShowScreenOptions] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

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

  const generateJSON = () => {
    if (!processedData) return '';
    return JSON.stringify(processedData, null, 2);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // En móviles, abrir modal automáticamente al ejecutar
    if (!isPlaying && window.innerWidth < 1024) {
      setShowMobileModal(true);
    }
  };

  const resetPreview = () => {
    setCurrentScreenIndex(0);
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

  const state: MetaPlaygroundState = {
    currentScreenIndex,
    isPlaying,
    copied,
    isExporting,
    showScreenOptions,
    showMobileModal,
  };

  const actions: MetaPlaygroundActions = {
    setCurrentScreenIndex,
    setIsPlaying,
    setCopied,
    setIsExporting,
    setShowScreenOptions,
    setShowMobileModal,
    togglePlay,
    resetPreview,
    copyJSONToClipboard,
    handleExport,
  };

  return {
    state,
    actions,
    processedData,
    currentScreen,
  };
}
