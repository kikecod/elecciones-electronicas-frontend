import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { ApiResponse, ApiError } from '../types';

// Generic hook for API calls
export function useApi<T>(
  endpoint: string,
  options?: {
    immediate?: boolean;
    dependencies?: any[];
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      setData(response.data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (options?.immediate !== false) {
      execute();
    }
  }, options?.dependencies || [endpoint]);

  return { data, loading, error, refetch: execute };
}

// Hook for POST requests
export function useApiPost<T, D = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (endpoint: string, data?: D): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

// Hook for PUT requests
export function useApiPut<T, D = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (endpoint: string, data?: D): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

// Hook for DELETE requests
export function useApiDelete<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (endpoint: string): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

// Hook for file uploads
export function useApiUpload<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [progress, setProgress] = useState(0);

  const execute = useCallback(async (
    endpoint: string, 
    file: File, 
    additionalData?: any
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      // For now, we'll use the basic upload method
      // In a real implementation, you might want to track upload progress
      const response = await apiClient.uploadFile<ApiResponse<T>>(endpoint, file, additionalData);
      setProgress(100);
      return response.data;
    } catch (err) {
      const error = {
        message: err instanceof Error ? err.message : 'Upload failed',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, progress };
}

// Specific hooks for common operations

// Elections
export function useElections() {
  return useApi('/elections');
}

export function useElection(id: number) {
  return useApi(`/elections/${id}`, { dependencies: [id] });
}

// Voters
export function useVoters() {
  return useApi('/voters');
}

export function useVoter(id: number) {
  return useApi(`/voters/${id}`, { dependencies: [id] });
}

// Parties
export function useParties() {
  return useApi('/parties');
}

export function useParty(id: number) {
  return useApi(`/parties/${id}`, { dependencies: [id] });
}

// Faculties and Careers
export function useFaculties() {
  return useApi('/faculties');
}

export function useCareers() {
  return useApi('/careers');
}

export function useCareersByFaculty(facultyId: number) {
  return useApi(`/faculties/${facultyId}/careers`, { dependencies: [facultyId] });
}

// Precincts and Devices
export function usePrecincts() {
  return useApi('/precincts');
}

export function useDevices() {
  return useApi('/devices');
}

export function useDevicesByPrecinct(precinctId: number) {
  return useApi(`/precincts/${precinctId}/devices`, { dependencies: [precinctId] });
}

// Results
export function useResults() {
  return useApi('/results');
}