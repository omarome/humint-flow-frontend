import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for input validation
 * 
 * @param {string} inputValue - Current input value
 * @param {object} fieldData - Field metadata including validator
 * @param {string} operator - Current operator
 * @returns {object} - Validation state { isValid, error }
 */
export const useInputValidation = (inputValue, fieldData, operator) => {
  const [validationError, setValidationError] = useState(null);

  // Validate input value
  const validateValue = useMemo(() => {
    if (!fieldData.validator) return { isValid: true, error: null };
    
    try {
      const result = fieldData.validator(inputValue, { fieldData, operator });
      if (result === true) {
        return { isValid: true, error: null };
      } else if (typeof result === 'string') {
        return { isValid: false, error: result };
      } else if (result && typeof result === 'object') {
        return { isValid: result.valid !== false, error: result.message || null };
      }
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message || 'Validation error' };
    }
  }, [inputValue, fieldData, operator]);

  // Update validation error when validation changes
  useEffect(() => {
    setValidationError(validateValue.error);
  }, [validateValue]);

  return {
    isValid: validateValue.isValid && !validationError,
    error: validationError,
  };
};
