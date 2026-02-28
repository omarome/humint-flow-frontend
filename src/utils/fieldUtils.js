/**
 * Utility functions for field configuration and validation
 */
export const extractUniqueValues = (data, fieldName) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const values = data
    .map(item => item[fieldName])
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(value => String(value).trim());

  // Get unique values and sort
  const uniqueValues = [...new Set(values)].sort((a, b) => 
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  return uniqueValues.map(value => ({
    name: value,
    label: value,
    value: value,
  }));
};

// ---------------------------------------------------------------------------
// SQL-injection / dangerous input detection
// ---------------------------------------------------------------------------

/**
 * Characters that should never appear in filter values because they can be
 * used for SQL injection, comment injection, or command chaining.
 */
const DANGEROUS_CHARS = /[;'"\\`]/;

/**
 * Common SQL keywords / patterns that are dangerous when embedded in filter
 * values.  Each entry is tested as a case-insensitive whole-word match so that
 * legitimate values like "border" don't trip on "OR".
 */
const SQL_PATTERNS = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE)\b/i,
  /\b(UNION\s+(ALL\s+)?SELECT)\b/i,
  /\b(OR|AND)\s+[\d'"].*=/i,      // e.g. "OR 1=1", "AND ''=''"
  /--/,                             // SQL line comment
  /\/\*/,                           // SQL block comment start
];

/**
 * Returns an error message if `value` contains characters or patterns
 * that could be used for SQL injection. Returns `null` when clean.
 */
const detectDangerousInput = (value) => {
  if (DANGEROUS_CHARS.test(value)) {
    const matched = value.match(DANGEROUS_CHARS);
    return `Character "${matched[0]}" is not allowed`;
  }

  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(value)) {
      return 'Value contains disallowed SQL keywords or patterns';
    }
  }

  return null; // clean
};

// ---------------------------------------------------------------------------
// Field validator factory
// ---------------------------------------------------------------------------

export const createFieldValidator = (fieldName, fieldType = 'string') => {
  return (value, context) => {
    const operator = context?.operator;

    // Operators that don't require a value
    if (operator === 'null' || operator === 'notNull') {
      return true;
    }

    // Empty check
    if (value === null || value === undefined || String(value).trim() === '') {
      return { valid: false, message: `${fieldName} cannot be empty` };
    }

    const stringValue = String(value).trim();

    // ---- Dangerous-input check (applies to ALL types) ----
    const dangerousMsg = detectDangerousInput(stringValue);
    if (dangerousMsg) {
      return { valid: false, message: dangerousMsg };
    }

    // ---- Type-specific checks ----
    switch (fieldType) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return { valid: false, message: 'Please enter a valid email address' };
        }
        break;
      }

      case 'number': {
        if (isNaN(Number(stringValue))) {
          return { valid: false, message: 'Please enter a valid number' };
        }
        if (operator && ['<', '>', '<=', '>='].includes(operator)) {
          if (isNaN(Number(stringValue))) {
            return { valid: false, message: 'Please enter a valid number for comparison' };
          }
        }
        break;
      }

      case 'string': {
        if (stringValue.length < 1) {
          return { valid: false, message: 'Value cannot be empty' };
        }
        if (stringValue.length > 255) {
          return { valid: false, message: 'Value is too long (max 255 characters)' };
        }
        break;
      }

      default:
        break;
    }

    return true;
  };
};

/**
 * Enhances a field config with:
 * - suggestion values extracted from the API data
 * - a validator function based on the field type
 *
 * Fields with a non-text editor type (radio, checkbox, etc.) still get a
 * validator attached but skip autocomplete-value extraction.
 */
export const enhanceFieldWithValues = (data, fieldConfig) => {
  const { name, label, type = 'string', values: existingValues, valueEditorType } = fieldConfig;

  // Create validator based on field type (applies to ALL field types)
  const validator = createFieldValidator(label || name, type);

  // Fields with a non-text editor type (radio, checkbox, select, etc.)
  // are already configured — just attach the validator.
  if (valueEditorType && valueEditorType !== 'text') {
    return { ...fieldConfig, validator };
  }

  // Extract suggestion values from API data (or use any custom values already set)
  const values = existingValues || extractUniqueValues(data, name);

  return {
    ...fieldConfig,
    values,
    validator,
    valueEditorType: 'text', // Will be handled by custom AutocompleteValueEditor
  };
};
