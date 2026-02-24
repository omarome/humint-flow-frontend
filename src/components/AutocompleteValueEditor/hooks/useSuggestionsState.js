import { useEffect, useRef } from 'react';

/**
 * Custom hook for managing suggestions state and notifying parent
 * 
 * @param {boolean} showSuggestions - Whether suggestions are visible
 * @param {number} filteredSuggestionsLength - Number of filtered suggestions
 * @param {function} onSuggestionsChange - Callback to notify parent
 * @param {string} editorId - Unique editor identifier
 */
export const useSuggestionsState = (
  showSuggestions,
  filteredSuggestionsLength,
  onSuggestionsChange,
  editorId
) => {
  const prevSuggestionsStateRef = useRef(false);
  
  useEffect(() => {
    if (!onSuggestionsChange) return;
    
    const hasSuggestions = showSuggestions && filteredSuggestionsLength > 0;
    
    // Only call callback if state actually changed
    if (hasSuggestions !== prevSuggestionsStateRef.current) {
      prevSuggestionsStateRef.current = hasSuggestions;
      onSuggestionsChange(hasSuggestions, editorId);
    }
    
    // Cleanup: notify parent that suggestions are closed when component unmounts
    return () => {
      if (prevSuggestionsStateRef.current) {
        onSuggestionsChange(false, editorId);
        prevSuggestionsStateRef.current = false;
      }
    };
  }, [showSuggestions, filteredSuggestionsLength, onSuggestionsChange, editorId]);
};
