// API Configuration
const API_BASE_URL = 'http://localhost:5158/api';

// API utility class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Set current user
  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        window.location.href = '/login';
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setAuthToken(response.token);
      this.setCurrentUser(response.user);
    }
    return response;
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  logout() {
    this.removeAuthToken();
    window.location.href = '/login';
  }

  // User methods
  async getLecturers() {
    return this.get('/users/lecturers');
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // Department methods
  async getDepartments() {
    return this.get('/departments');
  }

  async createDepartment(departmentData) {
    return this.post('/departments', departmentData);
  }

  async updateDepartment(id, departmentData) {
    return this.put(`/departments/${id}`, departmentData);
  }

  async deleteDepartment(id) {
    return this.delete(`/departments/${id}`);
  }

  // KPI methods
  async getKpis() {
    return this.get('/kpis');
  }

  async getKpisByDepartment(departmentId) {
    return this.get(`/kpis/department/${departmentId}`);
  }

  async createKpi(kpiData) {
    return this.post('/kpis', kpiData);
  }

  async updateKpi(id, kpiData) {
    return this.put(`/kpis/${id}`, kpiData);
  }

  async deleteKpi(id) {
    return this.delete(`/kpis/${id}`);
  }

  // KPI Assignment methods
  async getKpiAssignments() {
    return this.get('/kpiassignments');
  }

  async getKpiAssignmentsByLecturer(lecturerId) {
    return this.get(`/kpiassignments/lecturer/${lecturerId}`);
  }

  async assignKpiToLecturer(assignmentData) {
    return this.post('/kpiassignments', assignmentData);
  }

  async removeKpiAssignment(id) {
    return this.delete(`/kpiassignments/${id}`);
  }

  // Evaluation methods
  async getEvaluations() {
    return this.get('/evaluations');
  }

  async getEvaluationsByLecturer(lecturerId) {
    return this.get(`/evaluations/lecturer/${lecturerId}`);
  }

  async createEvaluation(evaluationData) {
    return this.post('/evaluations', evaluationData);
  }

  async updateEvaluation(id, evaluationData) {
    return this.put(`/evaluations/${id}`, evaluationData);
  }

  // Workplan methods
  async getWorkplans() {
    return this.get('/workplans');
  }

  async getWorkplansByLecturer(lecturerId) {
    return this.get(`/workplans/lecturer/${lecturerId}`);
  }

  async createWorkplan(workplanData) {
    return this.post('/workplans', workplanData);
  }

  async updateWorkplan(id, workplanData) {
    return this.put(`/workplans/${id}`, workplanData);
  }

  async deleteWorkplan(id) {
    return this.delete(`/workplans/${id}`);
  }

  // Reports methods
  async getLecturerReport(lecturerId, academicYear, semester) {
    return this.get(`/reports/lecturer/${lecturerId}?academicYear=${academicYear}&semester=${semester}`);
  }

  async getDepartmentReport(departmentId, academicYear, semester) {
    return this.get(`/reports/department/${departmentId}?academicYear=${academicYear}&semester=${semester}`);
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getLecturers,
  getUser,
  updateUser,
  deleteUser,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getKpis,
  getKpisByDepartment,
  createKpi,
  updateKpi,
  deleteKpi,
  getKpiAssignments,
  getKpiAssignmentsByLecturer,
  assignKpiToLecturer,
  removeKpiAssignment,
  getEvaluations,
  getEvaluationsByLecturer,
  createEvaluation,
  updateEvaluation,
  getWorkplans,
  getWorkplansByLecturer,
  createWorkplan,
  updateWorkplan,
  deleteWorkplan,
  getLecturerReport,
  getDepartmentReport,
  getCurrentUser,
  getAuthToken
} = apiService;