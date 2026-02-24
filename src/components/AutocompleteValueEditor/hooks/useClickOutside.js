import { useEffect } from 'react';

/**
 * Custom hook for handling clicks outside an element
 * 
 * @param {boolean} isActive - Whether the hook should be active
 * @param {object} containerRef - Ref to the container element
 * @param {object} suggestionsRef - Ref to the suggestions element (for portal)
 * @param {function} onClose - Callback when click outside is detected
 */
export const useClickOutside = (isActive, containerRef, suggestionsRef, onClose) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      const target = event.target;
      const isClickInsideInput = containerRef.current?.contains(target);
      const isClickInsideSuggestions = suggestionsRef.current?.contains(target);
      
      if (!isClickInsideInput && !isClickInsideSuggestions) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, containerRef, suggestionsRef, onClose]);
};
