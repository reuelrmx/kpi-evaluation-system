using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KpiAssignmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public KpiAssignmentsController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,HOD,Dean")]
    public async Task<IActionResult> AssignKpi([FromBody] CreateKpiAssignmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // Verify assignment permissions
        var targetUser = await _userManager.FindByIdAsync(dto.UserId);
        if (targetUser == null) return NotFound("User not found");

        // HODs can assign to lecturers in their department or to themselves (for Dean assignments)
        if (currentUserRoles.Contains("HOD"))
        {
            var targetUserRoles = await _userManager.GetRolesAsync(targetUser);
            
            // Allow HOD to be assigned KPIs by Dean
            if (targetUser.Id == currentUserId && targetUserRoles.Contains("HOD"))
            {
                // This is allowed - Dean assigning to HOD
            }
            // Or HOD assigning to lecturers in their department
            else if (targetUserRoles.Contains("Lecturer") && currentUser.DepartmentId == targetUser.DepartmentId)
            {
                // This is allowed - HOD assigning to lecturer in same department
            }
            else
            {
                return Forbid("You can only assign KPIs to lecturers in your department");
            }
        }

        // Check for duplicate assignments
        var existingAssignment = await _db.KpiAssignments
            .FirstOrDefaultAsync(a => a.KpiId == dto.KpiId && 
                                   a.LecturerId == dto.UserId && 
                                   a.AcademicYear == dto.AcademicYear && 
                                   a.Semester == dto.Semester);

        if (existingAssignment != null)
        {
            return BadRequest(new { message = "This KPI is already assigned to the user for this period" });
        }

        var assignment = new KpiAssignment
        {
            KpiId = dto.KpiId,
            LecturerId = dto.UserId,
            AcademicYear = dto.AcademicYear,
            Semester = dto.Semester
        };

        _db.KpiAssignments.Add(assignment);
        await _db.SaveChangesAsync();

        // Return assignment with KPI details
        var result = await _db.KpiAssignments
            .Include(a => a.Kpi)
            .ThenInclude(k => k.Department)
            .Include(a => a.Lecturer)
            .FirstOrDefaultAsync(a => a.Id == assignment.Id);

        return Ok(result);
    }

    [HttpGet("lecturer/{lecturerId}")]
    public async Task<IActionResult> GetByLecturer(string lecturerId)
    {
        var assignments = await _db.KpiAssignments
            .Include(a => a.Kpi)
            .ThenInclude(k => k.Department)
            .Include(a => a.Lecturer)
            .Where(a => a.LecturerId == lecturerId)
            .OrderBy(a => a.AcademicYear)
            .ThenBy(a => a.Semester)
            .ToListAsync();

        return Ok(assignments);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyAssignments()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var assignments = await _db.KpiAssignments
            .Include(a => a.Kpi)
            .ThenInclude(k => k.Department)
            .Where(a => a.LecturerId == currentUserId)
            .OrderBy(a => a.AcademicYear)
            .ThenBy(a => a.Semester)
            .ToListAsync();

        return Ok(assignments);
    }
    
    [HttpGet("assignable-users")]
    [Authorize(Roles = "Admin,Dean,HOD")]
    public async Task<IActionResult> GetAssignableUsers()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        var users = new List<object>();
        
        if (currentUserRoles.Contains("Dean"))
        {
            // Dean can assign KPIs to all HODs
            var hods = await _userManager.GetUsersInRoleAsync("HOD");
            users.AddRange(hods.Select(h => new { h.Id, h.FullName, h.Email, Role = "HOD", h.DepartmentId }));
        }
        else if (currentUserRoles.Contains("HOD"))
        {
            // HOD can assign KPIs to lecturers in their department
            var lecturers = await _userManager.GetUsersInRoleAsync("Lecturer");
            var departmentLecturers = lecturers.Where(l => l.DepartmentId == currentUser.DepartmentId);
            users.AddRange(departmentLecturers.Select(l => new { l.Id, l.FullName, l.Email, Role = "Lecturer", l.DepartmentId }));
        }
        else if (currentUserRoles.Contains("Admin"))
        {
            // Admin can assign to anyone
            var allUsers = await _userManager.Users.ToListAsync();
            foreach (var user in allUsers)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                users.Add(new { user.Id, user.FullName, user.Email, Role = userRoles.FirstOrDefault(), user.DepartmentId });
            }
        }

        return Ok(users);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,HOD,Dean")]
    public async Task<IActionResult> GetAll([FromQuery] int? departmentId = null, [FromQuery] string? academicYear = null, [FromQuery] string? semester = null)
    {
        var query = _db.KpiAssignments
            .Include(a => a.Kpi)
            .ThenInclude(k => k.Department)
            .Include(a => a.Lecturer)
            .ThenInclude(l => l.Department)
            .AsQueryable();

        if (departmentId.HasValue)
        {
            query = query.Where(a => a.Lecturer.DepartmentId == departmentId);
        }

        if (!string.IsNullOrEmpty(academicYear))
        {
            query = query.Where(a => a.AcademicYear == academicYear);
        }

        if (!string.IsNullOrEmpty(semester))
        {
            query = query.Where(a => a.Semester == semester);
        }

        var assignments = await query
            .OrderBy(a => a.AcademicYear)
            .ThenBy(a => a.Semester)
            .ThenBy(a => a.Lecturer.FullName)
            .ToListAsync();

        return Ok(assignments);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,HOD,Dean")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        var assignment = await _db.KpiAssignments
            .Include(a => a.Lecturer)
            .FirstOrDefaultAsync(a => a.Id == id);
            
        if (assignment == null) 
            return NotFound();

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // HODs can only delete assignments in their department
        if (currentUserRoles.Contains("HOD"))
        {
            if (assignment.Lecturer.DepartmentId != currentUser.DepartmentId)
            {
                return Forbid("You can only manage assignments in your department");
            }
        }

        _db.KpiAssignments.Remove(assignment);
        await _db.SaveChangesAsync();

        return Ok(new { message = "KPI assignment removed successfully" });
    }
}

// DTOs
public class CreateKpiAssignmentDto
{
    [Required]
    public int KpiId { get; set; }

    [Required]
    public string UserId { get; set; } = "";

    [Required]
    [StringLength(20)]
    public string AcademicYear { get; set; } = "";

    [Required]
    [StringLength(10)]
    public string Semester { get; set; } = "";
}
