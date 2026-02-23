/**
 * Utility functions for query operations
 */

/**
 * Counts the number of rules in a query object
 * Recursively traverses the query structure to count all rules
 * 
 * @param {object} query - The query object from react-querybuilder
 * @returns {number} - The total number of rules in the query
 */
export const countRules = (query) => {
  if (!query || !query.rules) return 0;

  let count = 0;
  const traverse = (rule) => {
    if (rule.rules) {
      // This is a rule group, traverse its children
      rule.rules.forEach(traverse);
    } else if (rule.field && rule.operator) {
      // This is an actual rule
      count++;
    }
  };

  traverse(query);
  return count;
};

/**
 * Formats a query object into a readable string
 * 
 * @param {object} query - The query object from react-querybuilder
 * @returns {string} - Formatted query string
 */
export const formatQueryString = (query) => {
  if (!query || !query.rules || query.rules.length === 0) {
    return 'No filters applied';
  }

  // This is a simplified formatter - you can enhance it based on your needs
  return JSON.stringify(query, null, 2);
};
