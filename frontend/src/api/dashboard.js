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
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication required');
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for handling auth errors
dashboardApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Dashboard API methods
const getDashboardStats = async () => {
	try {
		const [users, departments, evaluations] = await Promise.all([
			dashboardApi.get('/users'),
			dashboardApi.get('/departments'),
			dashboardApi.get('/evaluations')
		]);

		return {
			totalUsers: users.data.length,
			totalDepartments: departments.data.length,
			completedEvaluations: evaluations.data.filter(e => e.status === 'completed').length,
			pendingEvaluations: evaluations.data.filter(e => e.status === 'pending').length
		};
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		throw error; // Propagate error to be handled by the component
	}
};

const getRecentActivity = async () => {
	try {
		const [evaluations, workplans] = await Promise.all([
			dashboardApi.get('/evaluations'),
			dashboardApi.get('/workplans')
		]);

		// Combine and sort activities by date
		const activities = [
			...evaluations.data.map(evaluation => ({
				type: 'evaluation',
				action: evaluation.status === 'completed' ? 'completed' : 'submitted',
				date: new Date(evaluation.updatedAt),
				description: `Evaluation ${evaluation.status} by ${evaluation.evaluatorName}`
			})),
			...workplans.data.map(plan => ({
				type: 'workplan',
				action: 'submitted',
				date: new Date(plan.submittedAt),
				description: `Workplan submitted by ${plan.lecturerName}`
			}))
		].sort((a, b) => b.date - a.date)
		.slice(0, 10); // Get only the 10 most recent activities

		return activities;
	} catch (error) {
		console.error('Error fetching recent activity:', error);
		throw error; // Propagate error to be handled by the component
	}
};

const getPerformanceData = async () => {
	try {
		const [kpis, evaluations] = await Promise.all([
			dashboardApi.get('/kpis'),
			dashboardApi.get('/evaluations')
		]);

		// Process KPI performance data
		const performanceByKpi = kpis.data.map(kpi => {
			const kpiEvaluations = evaluations.data.filter(e => e.kpiId === kpi.id);
			const avgScore = kpiEvaluations.length > 0
				? kpiEvaluations.reduce((sum, e) => sum + e.score, 0) / kpiEvaluations.length
				: 0;

			return {
				name: kpi.name,
				score: avgScore,
				total: kpiEvaluations.length
			};
		});

		return performanceByKpi;
	} catch (error) {
		console.error('Error fetching performance data:', error);
		throw error; // Propagate error to be handled by the component
	}
};

const getDepartmentData = async () => {
	try {
		const [departments, evaluations] = await Promise.all([
			dashboardApi.get('/departments'),
			dashboardApi.get('/evaluations')
		]);

		// Calculate department statistics
		const departmentStats = departments.data.map(dept => {
			const deptEvaluations = evaluations.data.filter(e => e.departmentId === dept.id);
			const avgScore = deptEvaluations.length > 0
				? deptEvaluations.reduce((sum, e) => sum + e.score, 0) / deptEvaluations.length
				: 0;

			return {
				name: dept.name,
				avgScore: avgScore,
				totalEvaluations: deptEvaluations.length,
				lecturers: dept.lecturerCount || 0
			};
		});

		return departmentStats;
	} catch (error) {
		console.error('Error fetching department data:', error);
		throw error; // Propagate error to be handled by the component
	}
};

export default {
	getDashboardStats,
	getRecentActivity,
	getPerformanceData,
	getDepartmentData,
};
