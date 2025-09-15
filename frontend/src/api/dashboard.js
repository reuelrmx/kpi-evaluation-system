import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5158/api';

const dashboardApi = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add auth token to requests
dashboardApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Dashboard API methods
const getDashboardStats = async () => {
	const response = await dashboardApi.get('/dashboard/stats');
	return response.data;
};

const getRecentActivity = async () => {
	const response = await dashboardApi.get('/dashboard/recent-activity');
	return response.data;
};

const getPerformanceData = async () => {
	const response = await dashboardApi.get('/dashboard/performance');
	return response.data;
};

const getDepartmentData = async () => {
	const response = await dashboardApi.get('/dashboard/department-data');
	return response.data;
};

export default {
	getDashboardStats,
	getRecentActivity,
	getPerformanceData,
	getDepartmentData,
};
