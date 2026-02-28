/**
 * Utility functions for filtering data based on query builder rules
 */
const evaluateRule = (rule, item) => {
  const { field, operator, value } = rule;
  
  if (!field || !operator) return true; // Invalid rule, pass through

  const fieldValue = item[field];

  // Handle null / notNull operators first — they don't use a value
  if (operator === 'null') {
    return fieldValue === null || fieldValue === undefined;
  }
  if (operator === 'notNull') {
    return fieldValue !== null && fieldValue !== undefined;
  }

  // Treat empty values as "no-op" so partially filled rules don't exclude everything
  if (value === null || value === undefined || String(value).trim() === '') {
    return true;
  }
  const ruleValue = value;

  // Handle boolean fields (checkbox value comes as true/false or "true"/"false")
  if (typeof fieldValue === 'boolean') {
    const boolRuleValue = typeof ruleValue === 'boolean'
      ? ruleValue
      : String(ruleValue).toLowerCase() === 'true';

    switch (operator) {
      case '=':
        return fieldValue === boolRuleValue;
      case '!=':
        return fieldValue !== boolRuleValue;
      default:
        return true;
    }
  }

  // Convert to string for comparison if needed
  const itemValueStr = String(fieldValue || '').toLowerCase();
  const ruleValueStr = String(ruleValue || '').toLowerCase();
  
  switch (operator) {
    case '=':
      return String(fieldValue) === String(ruleValue);
    case '!=':
      return String(fieldValue) !== String(ruleValue);
    case '<':
      return Number(fieldValue) < Number(ruleValue);
    case '>':
      return Number(fieldValue) > Number(ruleValue);
    case '<=':
      return Number(fieldValue) <= Number(ruleValue);
    case '>=':
      return Number(fieldValue) >= Number(ruleValue);
    case 'contains':
      return itemValueStr.includes(ruleValueStr);
    case 'beginsWith':
      return itemValueStr.startsWith(ruleValueStr);
    case 'endsWith':
      return itemValueStr.endsWith(ruleValueStr);
    default:
      return true;
  }
};

const evaluateRuleGroup = (ruleGroup, item) => {
  if (!ruleGroup.rules || ruleGroup.rules.length === 0) {
    return true; // Empty group, pass through
  }
  
  const combinator = ruleGroup.combinator || 'and';
  const results = ruleGroup.rules.map((rule) => {
    if (rule.rules) {
      // This is a nested group
      return evaluateRuleGroup(rule, item);
    } else {
      // This is a rule
      return evaluateRule(rule, item);
    }
  });
  
  let matches;
  if (combinator === 'and') {
    matches = results.every((result) => result === true);
  } else {
    // 'or' combinator
    matches = results.some((result) => result === true);
  }

  // Handle the "not" toggle — negate the result of this group
  const isNot = ruleGroup.not || false;
  return isNot ? !matches : matches;
};

export const filterData = (data, query) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  // If no query or no rules, return all data
  if (!query || !query.rules || query.rules.length === 0) {
    return data;
  }
  
  // evaluateRuleGroup now handles the `not` flag at every level
  return data.filter((item) => evaluateRuleGroup(query, item));
};
