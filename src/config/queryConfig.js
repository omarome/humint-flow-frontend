import { defaultOperators as rqbDefaultOperators, toFullOption } from 'react-querybuilder';

/**
 * Re-export the library's defaultOperators so consumers don't need to
 * import from react-querybuilder directly.
 */
export const defaultOperators = rqbDefaultOperators;

// ---------------------------------------------------------------------------
// Operator names allowed per data type
// ---------------------------------------------------------------------------
const stringTypeOperators = [
  '=',
  '!=',
  'contains',
  'doesNotContain',
  'beginsWith',
  'doesNotBeginWith',
  'endsWith',
  'doesNotEndWith',
  'null',
  'notNull',
];

const numberTypeOperators = [
  '=',
  '!=',
  '<',
  '>',
  '<=',
  '>=',
  'between',
  'notBetween',
  'null',
  'notNull',
];

const booleanTypeOperators = ['='];

const stringOperators = rqbDefaultOperators.filter((op) => stringTypeOperators.includes(op.name));
const numberOperators = rqbDefaultOperators.filter((op) => numberTypeOperators.includes(op.name));
const booleanOperators = rqbDefaultOperators.filter((op) => booleanTypeOperators.includes(op.name));

// ---------------------------------------------------------------------------
// Maps backend variable types (PLC-style) to internal field types
// ---------------------------------------------------------------------------
const variableTypeMap = {
  STRING: 'string',
  BOOL: 'boolean',
  UDINT: 'number',
  UINT: 'number',
  INT: 'number',
  DINT: 'number',
  REAL: 'number',
  LREAL: 'number',
};

const operatorsByType = {
  string: stringOperators,
  number: numberOperators,
  boolean: booleanOperators,
};

// ---------------------------------------------------------------------------
// Build fields from /api/variables response
// ---------------------------------------------------------------------------

/**
 * Builds the full field list for react-querybuilder from the /api/variables
 * endpoint response.  Labels, names, and types come directly from the backend.
 *
 * @param {Object[]} variables — array from /api/variables
 * @returns {FullField[]} — fields ready for <QueryBuilder>
 */
export const buildFieldsFromVariables = (variables) => {
  if (!variables || variables.length === 0) return [];

  return variables.map((variable) => {
    const { name, label, type: backendType } = variable;
    const type = variableTypeMap[backendType] || 'string';
    const operators = operatorsByType[type] || stringOperators;

    const baseField = {
      name,
      label,
      type,
      operators,
    };

    // Boolean fields → radio buttons with True / False
    if (type === 'boolean') {
      return toFullOption({
        ...baseField,
        valueEditorType: 'radio',
        values: [
          { name: 'true', label: 'True' },
          { name: 'false', label: 'False' },
        ],
        defaultValue: 'true',
      });
    }

    // Number fields → number input
    if (type === 'number') {
      return toFullOption({ ...baseField, inputType: 'number' });
    }

    return toFullOption(baseField);
  });
};

