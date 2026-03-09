/**
 * API client for the Smart Filter Hub backend.
 *
 * All requests carry a JWT Bearer token obtained from AuthProvider.
 * The base URL is configured via the VITE_API_BASE_URL environment variable.
 */
import { getAccessToken } from '../context/AuthProvider';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Build Authorization header with the current JWT.
 */
function getAuthHeader() {
  const token = getAccessToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Fetches all users from the backend API.
 */
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetches field/variable definitions from the backend API.
 * Each variable has: id, name, label, offset, type (UDINT, STRING, BOOL, etc.)
 */
export const fetchVariables = async () => {
  const response = await fetch(`${API_BASE}/variables`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error(`Failed to fetch variables: ${response.status}`);
  }
  return response.json();
};
