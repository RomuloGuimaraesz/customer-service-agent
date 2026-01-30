/**
 * API Service Layer
 * Centralizes fetch logic, error handling, and demo mode detection
 */

/**
 * Builds common headers for API requests
 * @param {string|null} authHeader - Authentication header
 * @returns {Object} Headers object
 */
export const buildHeaders = (authHeader) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }
  
  return headers;
};

/**
 * Checks if the application is in demo mode
 * @param {string|null} authHeader - Authentication header
 * @returns {boolean} True if in demo mode
 */
export const isDemoMode = (authHeader) => {
  return !authHeader;
};

/**
 * Parses JSON response with error handling
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed JSON data
 */
const parseResponse = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    throw new Error('Invalid JSON response');
  }
};

/**
 * Handles API errors consistently
 * @param {Response} response - Fetch response object
 * @returns {Promise<never>} Throws error with appropriate message
 */
const handleApiError = async (response) => {
  if (response.status === 401) {
    throw new Error('Não autorizado - verifique suas credenciais');
  }
  
  throw new Error(`HTTP ${response.status}`);
};

/**
 * Fetches data from an API endpoint
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string|null} options.authHeader - Authentication header
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON stringified)
 * @returns {Promise<any>} Parsed response data
 * @throws {Error} If request fails or response is not ok
 */
export const fetchApi = async (url, { authHeader, method = 'GET', body } = {}) => {
  const headers = buildHeaders(authHeader);
  
  const fetchOptions = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return await parseResponse(response);
};

/**
 * Fetches data from an API endpoint with query parameters
 * @param {string} url - Base API endpoint URL
 * @param {Object} params - Query parameters object
 * @param {Object} options - Fetch options
 * @param {string|null} options.authHeader - Authentication header
 * @returns {Promise<any>} Parsed response data
 */
export const fetchApiWithParams = async (url, params, { authHeader } = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${url}?${queryString}`;
  return fetchApi(fullUrl, { authHeader });
};



















