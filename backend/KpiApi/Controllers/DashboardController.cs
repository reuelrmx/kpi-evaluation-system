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
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public DashboardController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var roles = await _userManager.GetRolesAsync(currentUser);

        if (roles.Contains("Admin") || roles.Contains("Dean"))
        {
            var totalUsers = await _db.Users.CountAsync();
            var totalDepartments = await _db.Departments.CountAsync();
            var totalKpis = await _db.Kpis.CountAsync();
            var totalEvaluations = await _db.Evaluations.CountAsync();
            var totalWorkplans = await _db.Workplans.CountAsync();
            var avgScore = await _db.Evaluations.AnyAsync()
                ? await _db.Evaluations.AverageAsync(e => e.Score)
                : 0;

            return Ok(new
            {
                Role = roles.First(),
                TotalUsers = totalUsers,
                TotalDepartments = totalDepartments,
                TotalKpis = totalKpis,
                TotalEvaluations = totalEvaluations,
                TotalWorkplans = totalWorkplans,
                AvgScore = avgScore
            });
        }
        else if (roles.Contains("HOD"))
        {
            var deptId = currentUser.DepartmentId ?? 0;
            var lecturers = await _db.Users
                .Where(u => u.DepartmentId == deptId)
                .ToListAsync();

            var evaluations = await _db.Evaluations
                .Where(e => e.Lecturer.DepartmentId == deptId)
                .ToListAsync();

            // KPIs are now global, not department-specific
            var kpis = await _db.Kpis.ToListAsync();

            return Ok(new
            {
                Role = "HOD",
                DepartmentId = deptId,
                LecturerCount = lecturers.Count,
                KpiCount = kpis.Count,
                AvgDeptScore = evaluations.Any() ? evaluations.Average(e => e.Score) : 0
            });
        }
        else if (roles.Contains("Lecturer"))
        {
            var evaluations = await _db.Evaluations
                .Where(e => e.LecturerId == currentUserId)
                .ToListAsync();

            var workplans = await _db.Workplans
                .Where(w => w.LecturerId == currentUserId)
                .ToListAsync();

            var kpis = await _db.KpiAssignments
                .Where(a => a.LecturerId == currentUserId)
                .Select(a => a.Kpi)
                .ToListAsync();

            return Ok(new
            {
                Role = "Lecturer",
                KpiCount = kpis.Count,
                WorkplanCount = workplans.Count,
                AvgScore = evaluations.Any() ? evaluations.Average(e => e.Score) : 0
            });
        }

        return Forbid("Unauthorized role");
    }
    // --- Added for frontend dashboard compatibility ---
    [AllowAnonymous]
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        // TODO: Replace with real data aggregation
        return Ok(new {
            totalUsers = 42,
            totalLecturers = 10,
            totalDepartments = 3,
            completedEvaluations = 25,
            pendingEvaluations = 5,
            systemHealth = "98%"
        });
    }

    [AllowAnonymous]
    [HttpGet("recent-activity")]
    public IActionResult GetRecentActivity()
    {
        // TODO: Replace with real activity data
        return Ok(new[] {
            new { id = 1, action = "System maintenance completed", time = "2 hours ago", type = "update" },
            new { id = 2, action = "New user accounts created", time = "4 hours ago", type = "create" },
            new { id = 3, action = "Performance reports generated", time = "1 day ago", type = "report" }
        });
    }

    [AllowAnonymous]
    [HttpGet("performance")]
    public IActionResult GetPerformanceData()
    {
        // TODO: Replace with real performance data
        return Ok(new[] {
            new { name = "Teaching", value = 85 },
            new { name = "Research", value = 72 },
            new { name = "Service", value = 88 },
            new { name = "Administration", value = 65 }
        });
    }

    [AllowAnonymous]
    [HttpGet("department-data")]
    public IActionResult GetDepartmentData()
    {
        // TODO: Replace with real department data
        return Ok(new[] {
            new { name = "Computer Science", lecturers = 5, avgScore = 90 },
            new { name = "Information Systems", lecturers = 3, avgScore = 85 },
            new { name = "Software Engineering", lecturers = 2, avgScore = 88 }
        });
    }
    // --- End added endpoints ---
}
