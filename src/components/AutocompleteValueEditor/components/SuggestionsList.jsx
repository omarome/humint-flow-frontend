import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Suggestions list component rendered via portal
 */
const SuggestionsList = ({
  suggestions,
  selectedIndex,
  suggestionsRef,
  position,
  onSuggestionSelect,
  onSuggestionHover,
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return createPortal(
    <ul 
      className="autocomplete-value-editor__suggestions"
      ref={suggestionsRef}
      role="listbox"
      style={{
        '--suggestions-top': `${position.top}px`,
        '--suggestions-left': `${position.left}px`,
        '--suggestions-width': `${position.width}px`,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className={`autocomplete-value-editor__suggestion ${index === selectedIndex ? 'autocomplete-value-editor__suggestion--selected' : ''}`}
          onClick={() => onSuggestionSelect(suggestion)}
          onMouseEnter={() => onSuggestionHover(index)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          {String(suggestion)}
        </li>
      ))}
    </ul>,
    document.body
  );
};

SuggestionsList.propTypes = {
  suggestions: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  suggestionsRef: PropTypes.object.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  onSuggestionSelect: PropTypes.func.isRequired,
  onSuggestionHover: PropTypes.func.isRequired,
};

export default SuggestionsList;
