using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "HOD,Dean,Admin")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;
    
    public ReportsController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet("department/{departmentId}")]
    public async Task<IActionResult> GetDepartmentReport(int departmentId, [FromQuery] string? academicYear = null, [FromQuery] string? semester = null)
    {
        var department = await _db.Departments.FindAsync(departmentId);
        if (department == null)
            return NotFound();

        var evaluationsQuery = _db.Evaluations
            .Include(e => e.Lecturer)
            .Include(e => e.Kpi)
            .Where(e => e.Lecturer.DepartmentId == departmentId);

        if (!string.IsNullOrEmpty(academicYear))
        {
            var assignments = _db.KpiAssignments.Where(a => a.AcademicYear == academicYear);
            if (!string.IsNullOrEmpty(semester))
            {
                assignments = assignments.Where(a => a.Semester == semester);
            }
            var assignmentIds = await assignments.Select(a => a.Id).ToListAsync();
            // Filter evaluations based on KPI assignments for the period
        }

        var evaluations = await evaluationsQuery.ToListAsync();

        var lecturerSummary = evaluations
            .GroupBy(e => e.LecturerId)
            .Select(g => new
            {
                LecturerId = g.Key,
                LecturerName = g.First().Lecturer.FullName,
                LecturerEmail = g.First().Lecturer.Email,
                AvgScore = g.Average(x => x.Score),
                EvaluationCount = g.Count(),
                LastEvaluated = g.Max(x => x.EvaluatedAt)
            })
            .OrderByDescending(x => x.AvgScore)
            .ToList();

        var overallStats = new
        {
            DepartmentName = department.Name,
            TotalEvaluations = evaluations.Count,
            AverageScore = evaluations.Any() ? evaluations.Average(e => e.Score) : 0,
            LecturerCount = lecturerSummary.Count,
            TopPerformer = lecturerSummary.FirstOrDefault(),
            Period = new { AcademicYear = academicYear, Semester = semester }
        };

        return Ok(new { OverallStats = overallStats, LecturerSummary = lecturerSummary });
    }

    [HttpGet("lecturer/{lecturerId}")]
    public async Task<IActionResult> GetLecturerReport(string lecturerId, [FromQuery] string? academicYear = null, [FromQuery] string? semester = null)
    {
        var lecturer = await _userManager.FindByIdAsync(lecturerId);
        if (lecturer == null)
            return NotFound();

        var evaluationsQuery = _db.Evaluations
            .Include(e => e.Kpi)
            .ThenInclude(k => k.Department)
            .Include(e => e.Hod)
            .Where(e => e.LecturerId == lecturerId);

        var evaluations = await evaluationsQuery
            .OrderByDescending(e => e.EvaluatedAt)
            .ToListAsync();

        var kpiPerformance = evaluations
            .GroupBy(e => e.KpiId)
            .Select(g => new
            {
                KpiId = g.Key,
                KpiTitle = g.First().Kpi.Title,
                KpiWeight = g.First().Kpi.Weight,
                LatestScore = g.OrderByDescending(x => x.EvaluatedAt).First().Score,
                AverageScore = g.Average(x => x.Score),
                EvaluationCount = g.Count(),
                LastEvaluated = g.Max(x => x.EvaluatedAt)
            })
            .ToList();

        var workplansSubmitted = await _db.Workplans
            .Where(w => w.LecturerId == lecturerId)
            .CountAsync();

        var overallStats = new
        {
            LecturerName = lecturer.FullName,
            LecturerEmail = lecturer.Email,
            DepartmentId = lecturer.DepartmentId,
            TotalEvaluations = evaluations.Count,
            OverallAverage = evaluations.Any() ? evaluations.Average(e => e.Score) : 0,
            WeightedAverage = kpiPerformance.Any() ? 
                kpiPerformance.Sum(k => k.LatestScore * k.KpiWeight) / kpiPerformance.Sum(k => k.KpiWeight) : 0,
            WorkplansSubmitted = workplansSubmitted,
            LastEvaluated = evaluations.Any() ? evaluations.Max(e => e.EvaluatedAt) : (DateTime?)null
        };

        return Ok(new { OverallStats = overallStats, KpiPerformance = kpiPerformance, RecentEvaluations = evaluations.Take(10) });
    }

    [HttpGet("overview")]
    [Authorize(Roles = "Dean,Admin")]
    public async Task<IActionResult> GetSystemOverview()
    {
        var departments = await _db.Departments.Include(d => d.Users).ToListAsync();
        var totalEvaluations = await _db.Evaluations.CountAsync();
        var totalWorkplans = await _db.Workplans.CountAsync();
        var totalKpis = await _db.Kpis.CountAsync();

        var departmentStats = new List<object>();
        
        foreach (var dept in departments)
        {
            var deptEvaluations = await _db.Evaluations
                .Include(e => e.Lecturer)
                .Where(e => e.Lecturer.DepartmentId == dept.Id)
                .ToListAsync();

            var lecturerCount = 0;
            var hodCount = 0;
            
            foreach (var user in dept.Users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Lecturer")) lecturerCount++;
                if (roles.Contains("HOD")) hodCount++;
            }

            departmentStats.Add(new
            {
                dept.Id,
                dept.Name,
                LecturerCount = lecturerCount,
                HodCount = hodCount,
                EvaluationCount = deptEvaluations.Count,
                AverageScore = deptEvaluations.Any() ? deptEvaluations.Average(e => e.Score) : 0
            });
        }

        return Ok(new
        {
            TotalDepartments = departments.Count,
            TotalEvaluations = totalEvaluations,
            TotalWorkplans = totalWorkplans,
            TotalKpis = totalKpis,
            DepartmentStats = departmentStats
        });
    }
}
