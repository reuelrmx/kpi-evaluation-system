// API Configuration
const API_BASE_URL = "http://localhost:5158/api";

// API utility class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ===================== AUTH HELPERS =====================
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  setAuthToken(token) {
    localStorage.setItem("authToken", token);
  }

  removeAuthToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  }

  getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  // ===================== REQUEST WRAPPER =====================
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.removeAuthToken();
        window.location.href = "/login";
        return;
      }

      // Handle JSON or text responses
      const contentType = response.headers.get("Content-Type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // fallback to text
      }

      if (!response.ok) {
        throw new Error(data?.message || data || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ===================== GENERIC METHODS =====================
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data) {
    return this.request(endpoint, { method: "POST", body: data });
  }

  async put(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: data });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // ===================== AUTH =====================
  async login(email, password) {
    const response = await this.post("/auth/login", { email, password });
    if (response.token) {
      this.setAuthToken(response.token);
      this.setCurrentUser(response.user);
    }
    return response;
  }

  async register(userData) {
    return this.post("/auth/register", userData);
  }

  logout() {
    this.removeAuthToken();
    window.location.href = "/login";
  }

  // ===================== USERS =====================
  async getLecturers() {
    return this.get("/users/lecturers");
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async updateLecturer(id, userData) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteLecturer(id) {
    return this.delete(`/users/${id}`);
  }

  // ===================== KPIS =====================
  async getAllKpis() {
    return this.get("/kpis");
  }

  async createKpiAssignment(assignmentData) {
    return this.post("/kpiassignments", assignmentData);
  }

  async getKpiAssignmentsByLecturer(lecturerId) {
    return this.get(`/kpiassignments/lecturer/${lecturerId}`);
  }

  async createEvaluation(evaluationData) {
    return this.post("/evaluations", evaluationData);
  }
}

// Export single instance
const apiService = new ApiService();
export default apiService;

// Convenience exports
export const {
  login,
  register,
  logout,
  getLecturers,
  getUser,
  updateLecturer,
  deleteLecturer,
  getAllKpis,
  createKpiAssignment,
  getKpiAssignmentsByLecturer,
  createEvaluation,
  getCurrentUser,
  getAuthToken,
} = apiService;
