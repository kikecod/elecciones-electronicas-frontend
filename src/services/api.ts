// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API Endpoints
export const API_ENDPOINTS = {
  // Elections
  ELECTIONS: '/elections',
  ELECTION_BY_ID: (id: number) => `/elections/${id}`,
  
  // Electoral Roll
  VOTERS: '/voters',
  VOTER_BY_ID: (id: number) => `/voters/${id}`,
  VOTER_BY_CI: (ci: string) => `/voters/ci/${ci}`,
  VOTER_REGISTER: '/voters/register',
  VOTER_FACE_CAPTURE: '/voters/face-capture',
  
  // Parties
  PARTIES: '/parties',
  PARTY_BY_ID: (id: number) => `/parties/${id}`,
  PARTY_REGISTER: '/parties/register',
  PARTY_REVIEW: '/parties/review',
  PARTY_APPROVE: (id: number) => `/parties/${id}/approve`,
  PARTY_REJECT: (id: number) => `/parties/${id}/reject`,
  
  // Academic Administration
  FACULTIES: '/faculties',
  FACULTY_BY_ID: (id: number) => `/faculties/${id}`,
  CAREERS: '/careers',
  CAREER_BY_ID: (id: number) => `/careers/${id}`,
  CAREERS_BY_FACULTY: (facultyId: number) => `/faculties/${facultyId}/careers`,
  
  // Precincts
  PRECINCTS: '/precincts',
  PRECINCT_BY_ID: (id: number) => `/precincts/${id}`,
  DEVICES: '/devices',
  DEVICE_BY_ID: (id: number) => `/devices/${id}`,
  DEVICES_BY_PRECINCT: (precinctId: number) => `/precincts/${precinctId}/devices`,
  
  // Voting
  VOTE: '/vote',
  VOTE_VERIFY: '/vote/verify',
  
  // Results
  RESULTS: '/results',
  RESULTS_BY_FACULTY: (faculty: string) => `/results/faculty/${faculty}`,
  RESULTS_BY_CAREER: (career: string) => `/results/career/${career}`,
  
  // Reports
  EXPORT_VOTERS: '/reports/voters/export',
  EXPORT_PRECINCTS: '/reports/precincts/export',
  EXPORT_RESULTS: '/reports/results/export',
  
  // Authentication (if needed)
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
};

export default apiClient;