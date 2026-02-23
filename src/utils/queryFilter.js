/**
 * Utility functions for filtering data based on query builder rules
 */

/**
 * Evaluates a single rule against a data item
 * 
 * @param {object} rule - The rule object from react-querybuilder
 * @param {object} item - The data item to evaluate
 * @returns {boolean} - Whether the item matches the rule
 */
const evaluateRule = (rule, item) => {
  const { field, operator, value } = rule;
  
  if (!field || !operator) return true; // Invalid rule, pass through
  
  const fieldValue = item[field];
  const ruleValue = value;
  
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

/**
 * Evaluates a rule group (which can contain rules and/or nested groups)
 * 
 * @param {object} ruleGroup - The rule group object
 * @param {object} item - The data item to evaluate
 * @returns {boolean} - Whether the item matches the rule group
 */
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
  
  if (combinator === 'and') {
    return results.every((result) => result === true);
  } else {
    // 'or' combinator
    return results.some((result) => result === true);
  }
};

/**
 * Filters an array of data items based on a query builder query
 * 
 * @param {array} data - Array of data items to filter
 * @param {object} query - The query object from react-querybuilder
 * @returns {array} - Filtered array of data items
 */
export const filterData = (data, query) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  // If no query or no rules, return all data
  if (!query || !query.rules || query.rules.length === 0) {
    return data;
  }
  
  // Filter data based on query
  return data.filter((item) => {
    // Handle 'not' combinator
    const isNot = query.not || false;
    const matches = evaluateRuleGroup(query, item);
    return isNot ? !matches : matches;
  });
};
