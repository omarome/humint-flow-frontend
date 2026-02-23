import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import './AutocompleteValueEditor.less';

/**
 * Custom Autocomplete Value Editor for React Query Builder
 * Provides autocomplete suggestions, clear button, and validation feedback
 * 
 * @param {string} value - Current input value
 * @param {function} handleOnChange - Callback when value changes
 * @param {array} values - Array of available value options
 * @param {object} fieldData - Field metadata including validator
 * @param {string} operator - Current operator
 * @param {string} inputType - HTML input type
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} placeholder - Placeholder text
 */
const AutocompleteValueEditor = ({
  value = '',
  handleOnChange,
  values = [],
  fieldData = {},
  operator,
  inputType = 'text',
  disabled = false,
  placeholder = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [validationError, setValidationError] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const containerRef = useRef(null);

  // Extract suggestions from values array or generate from field data
  const suggestions = useMemo(() => {
    if (values && values.length > 0) {
      return values.map(v => typeof v === 'object' ? (v.label || v.name || v.value) : String(v));
    }
    return [];
  }, [values]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!inputValue || inputValue.trim() === '') {
      return suggestions;
    }
    const lowerInput = inputValue.toLowerCase();
    return suggestions.filter(suggestion => 
      String(suggestion).toLowerCase().includes(lowerInput)
    );
  }, [inputValue, suggestions]);

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

  // Sync external value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
    
    if (handleOnChange) {
      handleOnChange(newValue);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (handleOnChange) {
      handleOnChange(suggestion);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle clear button click
  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (handleOnChange) {
      handleOnChange('');
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      if (e.key === 'Enter' && inputValue) {
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionSelect(filteredSuggestions[selectedIndex]);
        } else if (filteredSuggestions.length > 0) {
          // Auto-select first suggestion
          handleSuggestionSelect(filteredSuggestions[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // When suggestions are open, hint the parent container to allow more height
  useEffect(() => {
    if (!containerRef.current) return;

    const contentEl = containerRef.current.closest('.query-builder-controller__content');
    if (!contentEl) return;

    if (showSuggestions && filteredSuggestions.length > 0) {
      contentEl.classList.add('query-builder-controller__content--has-suggestions');
    } else {
      contentEl.classList.remove('query-builder-controller__content--has-suggestions');
    }

    // Cleanup on unmount
    return () => {
      contentEl.classList.remove('query-builder-controller__content--has-suggestions');
    };
  }, [showSuggestions, filteredSuggestions.length]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const hasValue = inputValue && inputValue.trim() !== '';
  const showValidation = hasValue && validationError !== null;
  const isValid = validateValue.isValid && !validationError;
  
  // Determine which buttons are visible for proper padding
  const hasClearButton = hasValue && !disabled;
  const hasValidationIcon = showValidation;
  
  // Build wrapper classes
  const wrapperClasses = [
    'autocomplete-value-editor__input-wrapper',
    showValidation ? (isValid ? 'autocomplete-value-editor__input-wrapper--valid' : 'autocomplete-value-editor__input-wrapper--invalid') : '',
    hasClearButton ? 'autocomplete-value-editor__input-wrapper--has-clear' : '',
    hasValidationIcon ? 'autocomplete-value-editor__input-wrapper--has-validation' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`autocomplete-value-editor ${showValidation && validationError ? 'autocomplete-value-editor--has-error' : ''}`}
      ref={containerRef}
    >
      <div className={wrapperClasses}>
        <input
          ref={inputRef}
          type={inputType}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder || 'Enter value...'}
          disabled={disabled}
          className="autocomplete-value-editor__input"
          aria-invalid={showValidation && !isValid}
          aria-describedby={showValidation ? `validation-${fieldData.name || 'value'}` : undefined}
          {...props}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            className="autocomplete-value-editor__clear-button"
            onClick={handleClear}
            aria-label="Clear value"
            tabIndex={-1}
          >
            <ClearIcon fontSize="small" />
          </button>
        )}
        {showValidation && (
          <span className="autocomplete-value-editor__validation-icon">
            {isValid ? (
              <CheckCircleIcon fontSize="small" className="autocomplete-value-editor__icon--valid" />
            ) : (
              <ErrorIcon fontSize="small" className="autocomplete-value-editor__icon--invalid" />
            )}
          </span>
        )}
      </div>
      
      {showValidation && validationError && (
        <div 
          id={`validation-${fieldData.name || 'value'}`}
          className="autocomplete-value-editor__error-message"
          role="alert"
        >
          {validationError}
        </div>
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul 
          className="autocomplete-value-editor__suggestions"
          ref={suggestionsRef}
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`autocomplete-value-editor__suggestion ${index === selectedIndex ? 'autocomplete-value-editor__suggestion--selected' : ''}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {String(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

AutocompleteValueEditor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleOnChange: PropTypes.func.isRequired,
  values: PropTypes.array,
  fieldData: PropTypes.object,
  operator: PropTypes.string,
  inputType: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default AutocompleteValueEditor;
