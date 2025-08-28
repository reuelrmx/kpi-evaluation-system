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
public class KpisController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public KpisController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? departmentId = null)
    {
        var query = _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod)
            .AsQueryable();

        if (departmentId.HasValue)
        {
            query = query.Where(k => k.DepartmentId == departmentId);
        }

        var kpis = await query
            .OrderBy(k => k.Title)
            .ToListAsync();

        return Ok(kpis);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var kpi = await _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod)
            .FirstOrDefaultAsync(k => k.Id == id);

        if (kpi == null)
            return NotFound();

        return Ok(kpi);
    }

    [HttpGet("department/{departmentId}")]
    public async Task<IActionResult> GetByDepartment(int departmentId)
    {
        var kpis = await _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod)
            .Where(k => k.DepartmentId == departmentId)
            .OrderBy(k => k.Title)
            .ToListAsync();

        return Ok(kpis);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyKpis()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        IQueryable<Kpi> query = _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod);

        // HODs can see KPIs in their department
        if (currentUserRoles.Contains("HOD"))
        {
            query = query.Where(k => k.DepartmentId == currentUser.DepartmentId);
        }
        // Deans can see all KPIs
        else if (!currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Dean"))
        {
            // For lecturers, show KPIs assigned to them
            var assignedKpiIds = await _db.KpiAssignments
                .Where(a => a.LecturerId == currentUserId)
                .Select(a => a.KpiId)
                .ToListAsync();

            query = query.Where(k => assignedKpiIds.Contains(k.Id));
        }

        var kpis = await query.OrderBy(k => k.Title).ToListAsync();
        return Ok(kpis);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Dean,HOD")]
    public async Task<IActionResult> Create([FromBody] CreateKpiDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // Verify department access
        if (currentUserRoles.Contains("HOD") && dto.DepartmentId != currentUser.DepartmentId)
        {
            return Forbid("You can only create KPIs for your department");
        }

        var kpi = new Kpi
        {
            Title = dto.Title,
            Description = dto.Description,
            Weight = dto.Weight,
            DepartmentId = dto.DepartmentId,
            CreatedByHodId = currentUserId
        };

        _db.Kpis.Add(kpi);
        await _db.SaveChangesAsync();

        // Return KPI with related data
        var result = await _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod)
            .FirstOrDefaultAsync(k => k.Id == kpi.Id);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Dean,HOD")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateKpiDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var kpi = await _db.Kpis.FindAsync(id);
        if (kpi == null)
            return NotFound();

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // Verify permissions
        if (currentUserRoles.Contains("HOD"))
        {
            if (kpi.DepartmentId != currentUser.DepartmentId || kpi.CreatedByHodId != currentUserId)
            {
                return Forbid("You can only update KPIs you created in your department");
            }
        }

        kpi.Title = dto.Title;
        kpi.Description = dto.Description;
        kpi.Weight = dto.Weight;

        await _db.SaveChangesAsync();

        var result = await _db.Kpis
            .Include(k => k.Department)
            .Include(k => k.CreatedByHod)
            .FirstOrDefaultAsync(k => k.Id == id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Dean,HOD")]
    public async Task<IActionResult> Delete(int id)
    {
        var kpi = await _db.Kpis.FindAsync(id);
        if (kpi == null)
            return NotFound();

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // Verify permissions
        if (currentUserRoles.Contains("HOD"))
        {
            if (kpi.DepartmentId != currentUser.DepartmentId || kpi.CreatedByHodId != currentUserId)
            {
                return Forbid("You can only delete KPIs you created in your department");
            }
        }

        // Check if KPI has assignments
        var hasAssignments = await _db.KpiAssignments.AnyAsync(a => a.KpiId == id);
        if (hasAssignments)
        {
            return BadRequest(new { message = "Cannot delete KPI that has assignments" });
        }

        _db.Kpis.Remove(kpi);
        await _db.SaveChangesAsync();

        return Ok(new { message = "KPI deleted successfully" });
    }
}

// DTOs
public class CreateKpiDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = "";

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, 1.0, ErrorMessage = "Weight must be between 0.01 and 1.0")]
    public decimal Weight { get; set; }

    [Required]
    public int? DepartmentId { get; set; }
}

public class UpdateKpiDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = "";

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(0.01, 1.0, ErrorMessage = "Weight must be between 0.01 and 1.0")]
    public decimal Weight { get; set; }
}
