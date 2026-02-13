"use client";

import { authClient } from "@/lib/auth";

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use the current origin or fallback to environment variable
    return process.env.NEXT_PUBLIC_API_URL || window.location.origin.replace(/\/$/, '');
  }

  // Server-side: use environment variable or default to localhost
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * API client that automatically attaches JWT token to requests
 */
class ApiClient {
  /**
   * Get the JWT token from auth client
   */
  private async getToken(): Promise<string | null> {
    try {
      // Get the session from Better Auth client
      const session = await authClient.getSession();
      return session?.accessToken || null;
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }

  /**
   * Make an authenticated API request
   */
  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle different status codes appropriately
      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again");
      } else if (response.status === 403) {
        throw new Error("Forbidden: You don't have permission to access this resource");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    }

    // For DELETE requests, there might not be a body to parse
    if (options.method === "DELETE") {
      return Promise.resolve(undefined as T);
    }

    return response.json();
  }

  /**
   * Get all tasks for the current user
   */
  async getTasks(status?: "all" | "pending" | "completed", sort?: string): Promise<Task[]> {
    let url = "/api/tasks";
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (sort) params.set("sort", sort);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.authenticatedRequest<Task[]>(url);
  }

  /**
   * Create a new task
   */
  async createTask(taskData: { title: string; description?: string }): Promise<Task> {
    return this.authenticatedRequest<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(id: number): Promise<Task> {
    return this.authenticatedRequest<Task>(`/api/tasks/${id}`);
  }

  /**
   * Update a task
   */
  async updateTask(id: number, taskData: Partial<{ title: string; description?: string }>): Promise<Task> {
    return this.authenticatedRequest<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    await this.authenticatedRequest(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(id: number, completed: boolean): Promise<Task> {
    return this.authenticatedRequest<Task>(`/api/tasks/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  }
}

// Define the Task type to match the backend model
export type Task = {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

// Export a singleton instance of the API client
export const apiClient = new ApiClient();

export default apiClient;