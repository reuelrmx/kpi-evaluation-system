using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public ReportsController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet("system")]
    [Authorize(Roles = "Admin,Dean")]
    public async Task<IActionResult> GetSystemReport()
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
            TotalUsers = totalUsers,
            TotalDepartments = totalDepartments,
            TotalKpis = totalKpis,
            TotalEvaluations = totalEvaluations,
            TotalWorkplans = totalWorkplans,
            AvgScore = avgScore
        });
    }

    [HttpGet("department/{departmentId}")]
    [Authorize(Roles = "Admin,Dean,HOD")]
    public async Task<IActionResult> GetDepartmentReport(int departmentId)
    {
        var department = await _db.Departments
            .Include(d => d.Users)
            .FirstOrDefaultAsync(d => d.Id == departmentId);

        if (department == null)
            return NotFound("Department not found");

        var lecturers = new List<object>();
        foreach (var user in department.Users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Lecturer"))
            {
                var evaluations = await _db.Evaluations
                    .Where(e => e.LecturerId == user.Id)
                    .ToListAsync();

                lecturers.Add(new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    AvgScore = evaluations.Any() ? evaluations.Average(e => e.Score) : 0,
                    Evaluations = evaluations
                });
            }
        }

        var deptEvaluations = await _db.Evaluations
            .Where(e => e.Lecturer.DepartmentId == departmentId)
            .ToListAsync();

        // Department-specific KPIs removed; KPIs are now global
        var deptKpis = new List<Kpi>();

        return Ok(new
        {
            department.Id,
            department.Name,
            LecturerCount = lecturers.Count,
            AvgDeptScore = deptEvaluations.Any() ? deptEvaluations.Average(e => e.Score) : 0,
            KpiCount = deptKpis.Count,
            Lecturers = lecturers
        });
    }

    [HttpGet("lecturer/{lecturerId}")]
    [Authorize(Roles = "Admin,Dean,HOD,Lecturer")]
    public async Task<IActionResult> GetLecturerReport(string lecturerId)
    {
        var lecturer = await _db.Users
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Id == lecturerId);

        if (lecturer == null)
            return NotFound("Lecturer not found");

        var evaluations = await _db.Evaluations
            .Include(e => e.Kpi)
            .Include(e => e.Hod)
            .Where(e => e.LecturerId == lecturerId)
            .OrderByDescending(e => e.EvaluatedAt)
            .ToListAsync();

        var workplans = await _db.Workplans
            .Where(w => w.LecturerId == lecturerId)
            .OrderByDescending(w => w.SubmittedAt)
            .ToListAsync();

        return Ok(new
        {
            lecturer.Id,
            lecturer.FullName,
            lecturer.Email,
            Department = lecturer.Department?.Name,
            AvgScore = evaluations.Any() ? evaluations.Average(e => e.Score) : 0,
            Evaluations = evaluations,
            Workplans = workplans
        });
    }
}
