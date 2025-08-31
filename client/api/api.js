import axios from "axios";

// Create axios instance for API Gateway
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    // If running in browser, try to get auth token from multiple sources
    if (typeof window !== 'undefined') {
      console.log('All cookies:', document.cookie);
      
      // First try localStorage (primary storage)
      let authToken = localStorage.getItem('authToken');
      
      if (authToken) {
        console.log('Found auth token in localStorage:', authToken.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${authToken}`;
        return config;
      }
      
      // Fallback to cookies
      authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (authToken) {
        console.log('Found auth token in cookies:', authToken.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${authToken}`;
      } else {
        console.warn('No auth token found in localStorage or cookies');
        
        // Try alternative cookie names
        const altToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('token=') || row.startsWith('authToken='))
          ?.split('=')[1];
          
        if (altToken) {
          console.log('Found alternative token:', altToken.substring(0, 20) + '...');
          config.headers.Authorization = `Bearer ${altToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a support API call - if so, don't redirect automatically
      const url = error.config?.url || '';
      if (url.includes('/support/')) {
        console.warn('Support API authentication failed - handling gracefully');
        // Let the support API handle the error gracefully
        return Promise.reject(error);
      }
      
      // For other APIs, redirect to login on 401 errors
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints organized by service

// Election Service endpoints
export const electionAPI = {
  // Elections
  getAllElections: () => api.get('/election'),
  getElectionById: (id) => api.get(`/election/${id}`),
  createElection: (data) => api.post('/election', data),
  updateElection: (id, data) => api.put(`/election/${id}`, data),
  deleteElection: (id) => api.delete(`/election/${id}`),
  
  // Candidates
  getCandidatesByElection: (electionId) => api.get(`/election/${electionId}/candidates`),
  createCandidate: (electionId, data) => api.post(`/election/${electionId}/candidates`, data),
  updateCandidate: (id, data) => api.put(`/election/candidates/${id}`, data),
  deleteCandidate: (id) => api.delete(`/election/candidates/${id}`),
  
  // Areas
  createArea: (data) => api.post('/election/areas', data),
  uploadDevices: (areaId, data) => api.post(`/election/areas/${areaId}/devices/upload`, data),
  
  // Observers
  createObserver: (electionId, data) => api.post(`/election/${electionId}/observers`, data),
  
  // Voters
  uploadVoters: (electionId, data) => api.post(`/election/${electionId}/voters/upload`, data),
  getVotersByElection: (electionId) => api.get(`/election/${electionId}/voters`),
  createVoter: (data) => api.post('/election/voters', data),
  updateVoter: (id, data) => api.put(`/election/voters/${id}`, data),
  deleteVoter: (id) => api.delete(`/election/voters/${id}`),
  
  // Qualifications
  getAllQualifications: () => api.get('/election/qualifications'),
  createQualification: (data) => api.post('/election/qualifications', data),
  assignQualification: (candidateId, data) => api.post(`/election/candidates/${candidateId}/qualifications`, data),
  
  // Health check
  getHealth: () => api.get('/election/health'),
};

// Voter Service endpoints
export const voterAPI = {
  // Voter Check-in
  checkInVoter: (electionId, voterId) => api.post(`/voters/elections/${electionId}/voters/${voterId}/check-in`),
  
  // Vote Casting
  castVote: (data) => api.post('/voters/cast', data),
  
  // Health check
  getHealth: () => api.get('/voters/health'),
};

// Support Service endpoints  
export const supportAPI = {
  // Chat functionality
  sendChatMessage: (data) => api.post('/support/chat', data),
  
  // Health check
  getHealth: () => api.get('/support/health'),
};// Census Service endpoints
export const censusAPI = {
  // Census Projects
  getAllProjects: () => api.get('/census'),
  createProject: (data) => api.post('/census', data),
  updateProject: (id, data) => api.put(`/census/${id}`, data),
  deleteProject: (id) => api.delete(`/census/${id}`),
  
  // Staff Management
  uploadStaff: (censusId, csvData) => api.post(`/census/${censusId}/staff/upload`, csvData, {
    headers: { 'Content-Type': 'application/octet-stream' }
  }),
  getStaffAssignments: () => api.get('/census/staff/assignments'),
  
  // Household Management
  uploadHouseholds: (censusId, csvData) => api.post(`/census/${censusId}/households/upload`, csvData, {
    headers: { 'Content-Type': 'application/octet-stream' }
  }),
  
  // Submissions
  submitCensusData: (censusId, householdId, surveyData) => 
    api.post(`/census/${censusId}/submissions?householdId=${householdId}`, surveyData),
  
  // Field Staff
  assignFieldStaff: (censusId, data) => api.post(`/census/${censusId}/fieldStaff`, data),
  
  // Health check
  getHealth: () => api.get('/census/health'),
};

// Auth Service endpoints (when needed later)
export const authAPI = {
  loginAdmin: (credentials) => api.post('/auth/admin/login', credentials),
  loginObserver: (credentials) => api.post('/auth/observer/login', credentials),
  loginFieldStaff: (credentials) => api.post('/auth/field_staff/login', credentials),
  loginPollingStaff: (credentials) => api.post('/auth/polling_staff/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth'),
  verifyToken: () => api.get('/auth'),
  login: (endpoint, credentials) => api.post(`/auth/${endpoint}`, credentials),
  getHealth: () => api.get('/auth/health'),
};

// Gateway health check
export const gatewayAPI = {
  getHealth: () => api.get('/health', { baseURL: 'http://localhost:8080' }),
  getInfo: () => api.get('/', { baseURL: 'http://localhost:8080' }),
};

// Helper functions for common operations
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data.message || `Request failed with status ${status}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  },
  
  // Format election data for display
  formatElection: (election) => ({
    ...election,
    startDate: new Date(election.start_time).toLocaleDateString(),
    endDate: new Date(election.end_time).toLocaleDateString(),
    isActive: new Date() >= new Date(election.start_time) && new Date() <= new Date(election.end_time),
  }),
  
  // Format candidate data for display
  formatCandidate: (candidate) => ({
    ...candidate,
    displayName: `${candidate.name} (${candidate.party})`,
  }),
  
  // Format voter data for display
  formatVoter: (voter) => ({
    ...voter,
    registrationDate: voter.created_at ? new Date(voter.created_at).toLocaleDateString() : 'N/A',
    status: voter.has_voted ? 'Voted' : 'Active',
  }),
};

export default api;