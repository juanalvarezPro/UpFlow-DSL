import { useState, useMemo } from 'react';
import { 
  FormChild, 
  DropdownChild, 
  FormElementChild, 
  DSLChild,
  ScreenLayout,
  ScreenData,
} from '../../components/playground/types';

interface FormData {
  [key: string]: string;
}

export interface ProcessedScreen {
  id: string;
  title: string;
  layout: ScreenLayout;
  data?: ScreenData;
}

export function useFormData(currentScreen: ProcessedScreen | null) {
  const [formData, setFormData] = useState<FormData>({});

  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearFormData = () => {
    setFormData({});
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

  return {
    formData,
    handleFormChange,
    clearFormData,
    isFormComplete,
  };
}
