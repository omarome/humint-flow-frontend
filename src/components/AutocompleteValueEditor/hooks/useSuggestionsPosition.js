import { useState, useEffect } from 'react';

/**
 * Custom hook for calculating suggestions position for portal
 * 
 * @param {boolean} showSuggestions - Whether suggestions are visible
 * @param {number} filteredSuggestionsLength - Number of filtered suggestions
 * @param {object} inputRef - Ref to the input element
 * @returns {object} - Position coordinates { top, left, width }
 */
export const useSuggestionsPosition = (showSuggestions, filteredSuggestionsLength, inputRef) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (showSuggestions && filteredSuggestionsLength > 0 && inputRef.current) {
      const updatePosition = () => {
        const inputRect = inputRef.current.getBoundingClientRect();
        setPosition({
          top: inputRect.bottom + window.scrollY + 4,
          left: inputRect.left + window.scrollX,
          width: inputRect.width,
        });
      };
      
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showSuggestions, filteredSuggestionsLength, inputRef]);

  return position;
};
