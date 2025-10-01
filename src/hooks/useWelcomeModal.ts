import { useState, useEffect } from 'react';

const WELCOME_MODAL_KEY = 'upflows_welcome_shown';

export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si es la primera vez que el usuario visita la app
    if (typeof window !== 'undefined' && localStorage) {
      const hasSeenWelcome = localStorage.getItem(WELCOME_MODAL_KEY);
      if (!hasSeenWelcome) {
        setIsOpen(true);
      }
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    }
  };

  const showModal = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    closeModal,
    showModal,
  };
}
