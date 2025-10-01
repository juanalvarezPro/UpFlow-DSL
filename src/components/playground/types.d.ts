/**
 * Type definitions for the Meta Playground components
 * This file contains all the interfaces and types used across the playground components
 */

/**
 * Base interface for all DSL child components
 */
export interface BaseChild {
  type: string;
}

/**
 * Text subheading component interface
 */
export interface TextSubheadingChild extends BaseChild {
  type: "TextSubheading";
  text: string;
}

/**
 * Text body component interface
 */
export interface TextBodyChild extends BaseChild {
  type: "TextBody";
  text: string;
}

/**
 * Image component interface
 */
export interface ImageChild extends BaseChild {
  type: "Image";
  src: string;
  width?: number;
  height?: number;
}

/**
 * Form component interface
 */
export interface FormChild extends BaseChild {
  type: "Form";
  name: string;
  children: FormElementChild[];
}

/**
 * Dropdown form element interface
 */
export interface DropdownChild extends BaseChild {
  type: "Dropdown";
  label: string;
  name: string;
  required: boolean;
  "data-source": string;
}

/**
 * Footer form element interface
 */
export interface FooterChild extends BaseChild {
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

/**
 * Union type for form element children
 */
export type FormElementChild = DropdownChild | FooterChild;

/**
 * Union type for all DSL children
 */
export type DSLChild = TextSubheadingChild | TextBodyChild | ImageChild | FormChild;

/**
 * Represents the structure of a data source item with its properties
 */
export interface DataSourceItem {
  type: string;
  properties: { [key: string]: { type: string } };
}

/**
 * Represents a data source containing items and example data for dropdowns
 */
export interface DataSource {
  type: string;
  items: DataSourceItem;
  "__example__": { id: string; title: string; enabled?: boolean }[];
}

/**
 * Contains all data sources available for the current screen
 */
export interface ScreenData {
  [key: string]: DataSource;
}

/**
 * Defines the layout structure of the screen with its children components
 */
export interface ScreenLayout {
  children: DSLChild[];
}

/**
 * Complete screen structure containing data, title, and layout
 */
export interface Screen {
  data: ScreenData;
  title: string;
  layout: ScreenLayout;
}

/**
 * Props for the MetaPlaygroundContent component
 */
export interface MetaPlaygroundContentProps {
  /** Current screen data and layout */
  currentScreen: Screen;
  /** Whether the playground is currently in playing mode */
  isPlaying: boolean;
  /** Form data values */
  formData: { [key: string]: string };
  /** Whether all required form fields are completed */
  isFormComplete: boolean;
  /** Callback when form field values change */
  onFormChange: (name: string, value: string) => void;
  /** Callback when continue button is clicked */
  onContinue: () => void;
}

/**
 * Props for the MetaPlaygroundModal component
 */
export interface MetaPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: Screen;
  isPlaying: boolean;
  formData: { [key: string]: string };
  isFormComplete: boolean;
  onFormChange: (name: string, value: string) => void;
  onContinue: () => void;
}

/**
 * Props for the ErrorState component
 */
export interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
}

/**
 * Hook return type for useMetaPlayground
 */
export interface UseMetaPlaygroundReturn {
  currentScreen: Screen | null;
  isPlaying: boolean;
  formData: { [key: string]: string };
  isFormComplete: boolean;
  error: Error | null;
  onFormChange: (name: string, value: string) => void;
  onContinue: () => void;
  onStartPlayground: () => void;
  onStopPlayground: () => void;
}

/**
 * Hook return type for useFormData
 */
export interface UseFormDataReturn {
  formData: { [key: string]: string };
  isFormComplete: boolean;
  updateFormData: (name: string, value: string) => void;
  resetFormData: () => void;
}

/**
 * Hook return type for useScreenNavigation
 */
export interface UseScreenNavigationReturn {
  currentScreenIndex: number;
  totalScreens: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToScreen: (index: number) => void;
}

/**
 * Configuration for the playground
 */
export interface PlaygroundConfig {
  screens: Screen[];
  autoPlay: boolean;
  showProgress: boolean;
  theme: 'light' | 'dark';
}

/**
 * Playground state interface
 */
export interface PlaygroundState {
  currentScreen: Screen | null;
  isPlaying: boolean;
  formData: { [key: string]: string };
  isFormComplete: boolean;
  error: Error | null;
  config: PlaygroundConfig;
}

