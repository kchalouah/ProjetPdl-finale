// Base API URL
const API_BASE_URL = "/api";

// Generic fetch function with error handling
export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    console.log(`Fetching from: ${url}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    if (options.method === "DELETE" && response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Helper functions for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
      fetchFromApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
      fetchFromApi<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),

  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
      fetchFromApi<T>(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
      fetchFromApi<T>(endpoint, { ...options, method: "DELETE" }),
};

// Function to check if the API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.warn("API availability check failed:", error);
    return false;
  }
}
