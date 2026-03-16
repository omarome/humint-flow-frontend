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

/**
 * Saves a filter view to the backend.
 * @param {Object} viewData - { name: string, queryJson: string }
 */
export const saveView = async (viewData) => {
  const response = await fetch(`${API_BASE}/saved-views`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(viewData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save view: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches all saved filter views.
 */
export const fetchSavedViews = async () => {
  const response = await fetch(`${API_BASE}/saved-views`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error(`Failed to fetch saved views: ${response.status}`);
  }
  return response.json();
};

/**
 * Deletes a saved filter view.
 * @param {number|string} id - The ID of the view to delete.
 */
export const deleteSavedView = async (id) => {
  const response = await fetch(`${API_BASE}/saved-views/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error(`Failed to delete saved view: ${response.status}`);
  }
  
  // Return true on success
  return true;
};

