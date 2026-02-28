import React, { useCallback, useState, useMemo, useEffect } from 'react';
import 'react-querybuilder/dist/query-builder.css';
import QueryBuilderController from './src/components/QueryBuilderController/QueryBuilderController';
import ResultsTable from './src/components/ResultsTable/ResultsTable';
import { filterData } from './src/utils/queryFilter';
import { fetchUsers, fetchVariables } from './src/services/userApi';
import { enhanceFieldWithValues } from './src/utils/fieldUtils';
import { buildFieldsFromVariables, defaultOperators } from './src/config/queryConfig';
import './src/styles/CollapsibleList.less';

/**
 * CollapsibleList Component
 *
 * - Fetches data from /api/users
 * - Fetches field definitions from /api/variables
 * - Builds query builder fields from the variables endpoint
 * - Enhances fields with autocomplete values extracted from the data
 */
const CollapsibleList = () => {
  const [users, setUsers] = useState([]);
  const [variables, setVariables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    combinator: 'and',
    rules: [],
  });

  // Fetch users and variables in parallel from the backend
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [usersData, variablesData] = await Promise.all([
          fetchUsers(),
          fetchVariables(),
        ]);
        if (!cancelled) {
          setUsers(usersData);
          setVariables(variablesData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build fields from /api/variables, then enhance with autocomplete values from data
  const fields = useMemo(() => {
    const baseFields = buildFieldsFromVariables(variables);
    return baseFields.map((field) => enhanceFieldWithValues(users, field));
  }, [variables, users]);

  const operators = defaultOperators;

  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  // Filter data based on query (client-side filtering)
  const filteredData = useMemo(() => {
    return filterData(users, query);
  }, [users, query]);

  // Derive table columns from variables (uses label from the backend)
  const tableColumns = useMemo(() => {
    if (users.length === 0) return [];

    // Build a label lookup from the variables endpoint
    const labelMap = new Map(variables.map((v) => [v.name, v.label]));

    // Include all keys from the data, using the backend label when available
    return Object.keys(users[0]).map((key) => ({
      key,
      label: labelMap.get(key) || key,
    }));
  }, [users, variables]);

  if (error) {
    return (
      <div className="collapsible-list" data-testid="collapsible-list">
        <div className="collapsible-list__error">
          Failed to load data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="collapsible-list" data-testid="collapsible-list">
      <QueryBuilderController
        fields={fields}
        operators={operators}
        label="Advanced filters"
        onQueryChange={handleQueryChange}
      />
      <ResultsTable
        data={filteredData}
        columns={tableColumns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CollapsibleList;
