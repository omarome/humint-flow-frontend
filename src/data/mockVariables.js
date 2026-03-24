/**
 * Mock variable definitions matching the /api/variables endpoint shape.
 * Used as fallback when the backend is unavailable.
 */
export const mockVariables = [
  { id: 1, name: 'fullName', label: 'Full Name', offset: 0, type: 'STRING' },
  { id: 2, name: 'email', label: 'Email', offset: 4, type: 'EMAIL' },
  { id: 3, name: 'userType', label: 'User Type', offset: 8, type: 'STRING' },
  { id: 4, name: 'age', label: 'Age', offset: 12, type: 'UDINT' },
  { id: 5, name: 'status', label: 'Account Status', offset: 16, type: 'STRING' },
  { id: 6, name: 'isOnline', label: 'Online Status', offset: 20, type: 'BOOL' }
];
