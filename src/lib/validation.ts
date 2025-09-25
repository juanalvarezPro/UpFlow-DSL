/**
 * DSL Validation Module
 * 
 * This module contains validation logic for DSL content,
 * including warnings for common issues and best practices.
 */

export interface ValidationWarning {
  message: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface ValidationResult {
  warnings: ValidationWarning[];
}

/**
 * Validates date formats in DSL lists
 * Warns when dates are written with hyphens instead of spaces
 */
export function validateDateFormats(dslText: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const lines = dslText.split('\n');
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Check if this is a list declaration
    if (line.startsWith('Lista ')) {
      inList = true;
      continue;
    }

    // Check if we're in a list and this is an option line
    if (inList && /^\d+\./.test(line)) {
      // Extract the option content after the number and dot
      const optionMatch = line.match(/^\d+\.\s*(.+)/);
      if (optionMatch) {
        const optionContent = optionMatch[1].trim();
        
        // Check if the option starts with a date pattern (YYYY-MM-DD)
        const dateMatch = optionContent.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const dateWithHyphens = dateMatch[1];
          const columnStart = line.indexOf(dateWithHyphens) + 1;
          const columnEnd = columnStart + dateWithHyphens.length - 1;

          warnings.push({
            message: `⚠️ Advertencia: No escribas las fechas con guiones (${dateWithHyphens}). Escríbelas vacías con espacios, nosotros hacemos el parseo.`,
            location: {
              start: { line: lineNumber, column: columnStart },
              end: { line: lineNumber, column: columnEnd }
            }
          });
        }
      }
    }

    // Reset list state when we encounter a new screen or empty line that ends the list
    if (inList && (line.startsWith('Pantalla ') || (line === '' && i > 0 && lines[i - 1].trim() === ''))) {
      inList = false;
    }
  }

  return warnings;
}

/**
 * Main validation function that runs all validators
 * Returns all warnings found in the DSL content
 */
export function validateDSL(dslText: string): ValidationResult {
  const allWarnings: ValidationWarning[] = [];

  // Run all validation functions
  allWarnings.push(...validateDateFormats(dslText));

  // Future validators can be added here
  // allWarnings.push(...validateOtherRules(dslText));

  return {
    warnings: allWarnings
  };
}
