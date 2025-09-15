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
    public async Task<IActionResult> GetAll()
    {
        var kpis = await _db.Kpis
            .Include(k => k.CreatedByHod)
            .OrderBy(k => k.Title)
            .ToListAsync();
        return Ok(kpis);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var kpi = await _db.Kpis
            .Include(k => k.CreatedByHod)
            .FirstOrDefaultAsync(k => k.Id == id);
        if (kpi == null)
            return NotFound();
        return Ok(kpi);
    }



    [HttpGet("my")]
    public async Task<IActionResult> GetMyKpis()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserId))
            return Unauthorized();

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
            return Unauthorized();

        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        IQueryable<Kpi> query = _db.Kpis
            .Include(k => k.CreatedByHod);
        if (!currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Dean"))
        {
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
        if (string.IsNullOrEmpty(currentUserId))
            return Unauthorized();

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
            return Unauthorized();

        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        var kpi = new Kpi
        {
            Title = dto.Title,
            Description = dto.Description,
            Weight = dto.Weight,
            CreatedByHodId = currentUserId
        };

        _db.Kpis.Add(kpi);
        await _db.SaveChangesAsync();

        var result = await _db.Kpis
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
        if (string.IsNullOrEmpty(currentUserId))
            return Unauthorized();

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
            return Unauthorized();

        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // HODs can only update KPIs they created
        if (currentUserRoles.Contains("HOD") && kpi.CreatedByHodId != currentUserId)
        {
            return Forbid("You can only update KPIs you created");
        }

        kpi.Title = dto.Title;
        kpi.Description = dto.Description;
        kpi.Weight = dto.Weight;

        await _db.SaveChangesAsync();

        var result = await _db.Kpis
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
        if (string.IsNullOrEmpty(currentUserId))
            return Unauthorized();

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
        if (currentUser == null)
            return Unauthorized();

        var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

        // HODs can only delete KPIs they created
        if (currentUserRoles.Contains("HOD") && kpi.CreatedByHodId != currentUserId)
        {
            return Forbid("You can only delete KPIs you created");
        }

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
