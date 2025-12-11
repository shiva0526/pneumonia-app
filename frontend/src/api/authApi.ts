import apiClient from "./apiClient";

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    // The backend sets the HttpOnly cookie automatically upon success.
    // In addition, the backend also returns an access token in the JSON response.
    // Some browsers/DEV setups block cross-site HttpOnly cookies for XHR; to
    // make the flow reliable in development, attach the returned access token
    // to the axios default Authorization header so subsequent requests (e.g. /auth/me)
    // will include it.
    const response = await apiClient.post("/auth/login", { email, password });
    const data = response.data;
    if (data?.access_token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    }
    return data;
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      name: name || email.split("@")[0], // Fallback name
    });
    const data = response.data;
    if (data?.access_token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    }
    return data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    // Remove Authorization header client-side as well
    delete apiClient.defaults.headers.common["Authorization"];
  },

  getMe: async () => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  }
};