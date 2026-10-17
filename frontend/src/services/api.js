// API base URL configuration
// In Vite dev with proxy, '/api' routes to backend, or use full URL from env
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:3000/api');

/**
 * Universal fetch wrapper that handles JSON formatting, Authorization headers, and error extraction
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    token = localStorage.getItem('cb_token'),
    headers = {},
    ...customConfig
  } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  // Ensure leading slash if missing
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, config);

    // Parse JSON response safely
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If backend server is down or unreachable
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to CareerBridge server. Please ensure backend is running on port 3000.');
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export const authService = {
  /**
   * Register a new user
   * @param {Object} payload - { name, email, password, role }
   */
  async register({ name, email, password, role = 'candidate' }) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
  },

  /**
   * Log in user
   * @param {Object} payload - { email, password }
   */
  async login({ email, password }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  /**
   * Fetch currently logged-in user profile
   */
  async getMe(token) {
    return apiRequest('/auth/me', {
      method: 'GET',
      token,
    });
  },

  /**
   * Logout user
   */
  async logout(token) {
    try {
      return await apiRequest('/auth/logout', {
        method: 'POST',
        token,
      });
    } catch {
      // Ignore logout API failures, clear client state anyway
      return { message: 'Logged out' };
    }
  },
};

export const jobService = {
  /**
   * Fetch all jobs with optional filters
   * @param {Object} filters - { search, location, jobType, companyId }
   */
  async getAllJobs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.companyId) params.append('companyId', filters.companyId);
    
    const query = params.toString();
    return apiRequest(`/jobs/getalljob${query ? `?${query}` : ''}`);
  },

  /**
   * Fetch a single job by ID
   * @param {string|number} id
   */
  async getJobById(id) {
    return apiRequest(`/jobs/getajob/${id}`);
  },
};

export const applicationService = {
  /**
   * Fetch candidate's own applications
   */
  async getMyApplications() {
    return apiRequest('/applications/myapplication');
  },

  /**
   * Apply for a job
   * @param {Object} payload - { jobId, coverLetter }
   */
  async applyForJob({ jobId, coverLetter = '' }) {
    return apiRequest('/applications/applyforjob', {
      method: 'POST',
      body: { jobId, coverLetter },
    });
  },
};

export const candidateService = {
  /**
   * Fetch candidate profile
   */
  async getProfile() {
    return apiRequest('/candidate/getprofile');
  },
};

export default authService;

