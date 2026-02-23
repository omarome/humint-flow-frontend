import React from 'react';
import PropTypes from 'prop-types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './CollapseButton.less';

/**
 * Reusable collapse button component
 * 
 * @param {boolean} isExpanded - Whether the content is currently expanded
 * @param {function} onToggle - Callback function when button is clicked
 * @param {string} expandedLabel - Label to show when expanded
 * @param {string} collapsedLabel - Label to show when collapsed
 * @param {string} className - Additional CSS classes
 * @param {object} buttonProps - Additional props to pass to the button element
 */
const CollapseButton = ({
  isExpanded,
  onToggle,
  expandedLabel = 'Hide',
  collapsedLabel = 'Show',
  className = '',
  ...buttonProps
}) => {
  const buttonText = isExpanded ? expandedLabel : collapsedLabel;

  return (
    <button
      className={`collapse-button ${isExpanded ? 'collapse-button--expanded' : ''} ${className}`.trim()}
      onClick={onToggle}
      aria-expanded={isExpanded}
      type="button"
      {...buttonProps}
    >
      <span className="collapse-button__text">{buttonText}</span>
      {isExpanded ? (
        <ExpandLessIcon className="collapse-button__icon" aria-hidden="true" />
      ) : (
        <ExpandMoreIcon className="collapse-button__icon" aria-hidden="true" />
      )}
    </button>
  );
};

CollapseButton.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  expandedLabel: PropTypes.string,
  collapsedLabel: PropTypes.string,
  className: PropTypes.string,
};

export default CollapseButton;
