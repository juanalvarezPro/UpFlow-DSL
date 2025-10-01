import { toast } from 'sonner';
import { FormChild, FooterChild, FormElementChild, DSLChild, ScreenLayout, ScreenData } from '../../components/playground/types';

interface ProcessedData {
  screens: Array<{
    id: string;
    title: string;
    layout: ScreenLayout;
    data?: ScreenData;
  }>;
}

export function useScreenNavigation(
  currentScreen: ProcessedData['screens'][0] | null,
  processedData: ProcessedData | null,
  currentScreenIndex: number,
  setCurrentScreenIndex: (index: number) => void,
  clearFormData: () => void
) {
  const handleContinue = () => {
    // Buscar el botón Footer en el formulario actual para obtener la acción de navegación
    const form = currentScreen?.layout?.children?.find((child: DSLChild): child is FormChild => child.type === "Form");
    const footerButton = form?.children?.find((child: FormElementChild): child is FooterChild => child.type === "Footer");
    
    if (footerButton?.["on-click-action"]?.next?.name) {
      const nextScreenName = footerButton["on-click-action"].next.name;
      const nextScreenIndex = processedData?.screens.findIndex((screen: { id: string }) => screen.id === nextScreenName);
      
      if (nextScreenIndex !== undefined && nextScreenIndex !== -1) {
        setCurrentScreenIndex(nextScreenIndex);
        clearFormData(); // Limpiar formulario al cambiar de pantalla
      } else {
        // Si no encuentra la pantalla, mostrar mensaje de éxito
        alert('¡Flow completado exitosamente!');
      }
    } else {
      // Si no hay navegación definida, ir a la siguiente pantalla secuencial
      if (currentScreenIndex < (processedData?.screens.length ?? 0) - 1) {
        setCurrentScreenIndex(currentScreenIndex + 1);
        clearFormData(); // Limpiar formulario al cambiar de pantalla
      } else {
        // Si es la última pantalla, mostrar mensaje de éxito
        toast.success('¡Flow completado exitosamente!');
      }
    }
  };

  return {
    handleContinue,
  };
}
