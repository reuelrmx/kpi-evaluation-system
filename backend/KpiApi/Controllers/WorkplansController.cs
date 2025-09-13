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
public class WorkplansController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<AppUser> _userManager;

        public WorkplansController(AppDbContext db, UserManager<AppUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = "Lecturer,HOD,Dean")]
        public async Task<IActionResult> Submit([FromBody] CreateWorkplanDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            var currentUserRoles = await _userManager.GetRolesAsync(currentUser);

            // Validate period dates
            if (dto.PeriodEnd <= dto.PeriodStart)
            {
                return BadRequest(new { message = "Period end date must be after start date" });
            }

            // Determine who to submit to based on role hierarchy
            string? submittedToId = null;
            if (dto.SubmitToSuperior)
            {
                if (currentUserRoles.Contains("Dean"))
                {
                    // Dean submits to Admin
                    var admin = await _userManager.GetUsersInRoleAsync("Admin");
                    submittedToId = admin.FirstOrDefault()?.Id;
                }
                else if (currentUserRoles.Contains("HOD"))
                {
                    // HOD submits to Dean
                    var dean = await _userManager.GetUsersInRoleAsync("Dean");
                    submittedToId = dean.FirstOrDefault()?.Id;
                }
                else if (currentUserRoles.Contains("Lecturer"))
                {
                    // Lecturer submits to HOD of their department
                    var hods = await _userManager.GetUsersInRoleAsync("HOD");
                    var departmentHod = hods.FirstOrDefault(h => h.DepartmentId == currentUser.DepartmentId);
                    submittedToId = departmentHod?.Id;
                }
            }

            var workplan = new Workplan
            {
                LecturerId = currentUserId,
                PeriodStart = dto.PeriodStart,
                PeriodEnd = dto.PeriodEnd,
                Content = dto.Content,
                SubmittedToId = submittedToId,
                Status = submittedToId != null ? "Submitted" : "Draft"
            };

            _db.Workplans.Add(workplan);
            await _db.SaveChangesAsync();

            // Return workplan with lecturer details
            var result = await _db.Workplans
                .Include(w => w.Lecturer)
                .ThenInclude(l => l.Department)
                .Include(w => w.SubmittedTo)
                .FirstOrDefaultAsync(w => w.Id == workplan.Id);

            return Ok(result);
        }

        [HttpGet("lecturer/{lecturerId}")]
        public async Task<IActionResult> GetByLecturer(string lecturerId)
        {
            var workplans = await _db.Workplans
                .Include(w => w.Lecturer)
                .Where(w => w.LecturerId == lecturerId)
                .OrderByDescending(w => w.SubmittedAt)
                .ToListAsync();

            return Ok(workplans);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyWorkplans()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var workplans = await _db.Workplans
                .Include(w => w.SubmittedTo)
                .Where(w => w.LecturerId == currentUserId)
                .OrderByDescending(w => w.SubmittedAt)
                .ToListAsync();

            return Ok(workplans);
        }
        
        [HttpGet("submitted-to-me")]
        [Authorize(Roles = "Admin,Dean,HOD")]
        public async Task<IActionResult> GetWorkplansSubmittedToMe()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var workplans = await _db.Workplans
                .Include(w => w.Lecturer)
                .ThenInclude(l => l.Department)
                .Where(w => w.SubmittedToId == currentUserId)
                .OrderByDescending(w => w.SubmittedAt)
                .ToListAsync();

            return Ok(workplans);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,HOD,Dean")]
        public async Task<IActionResult> GetAll([FromQuery] int? departmentId = null)
        {
            var query = _db.Workplans
                .Include(w => w.Lecturer)
                .ThenInclude(l => l.Department)
                .AsQueryable();

            if (departmentId.HasValue)
            {
                query = query.Where(w => w.Lecturer.DepartmentId == departmentId);
            }

            var workplans = await query
                .OrderByDescending(w => w.SubmittedAt)
                .ToListAsync();

            return Ok(workplans);
        }
        
        [HttpPut("{id}")]
        [Authorize(Roles = "Lecturer,HOD,Dean")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkplanDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var workplan = await _db.Workplans.FindAsync(id);
            if (workplan == null)
                return NotFound();

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Only the creator can update their workplan
            if (workplan.LecturerId != currentUserId)
            {
                return Forbid("You can only update your own workplans");
            }

            // Validate period dates
            if (dto.PeriodEnd <= dto.PeriodStart)
            {
                return BadRequest(new { message = "Period end date must be after start date" });
            }

            workplan.PeriodStart = dto.PeriodStart;
            workplan.PeriodEnd = dto.PeriodEnd;
            workplan.Content = dto.Content;
            workplan.SubmittedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            var result = await _db.Workplans
                .Include(w => w.Lecturer)
                .ThenInclude(l => l.Department)
                .FirstOrDefaultAsync(w => w.Id == id);

            return Ok(result);
        }
        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Dean")]
        public async Task<IActionResult> Delete(int id)
        {
            var workplan = await _db.Workplans.FindAsync(id);
            if (workplan == null)
                return NotFound();

            _db.Workplans.Remove(workplan);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Workplan deleted successfully" });
        }
}

// DTOs
public class CreateWorkplanDto
{
    [Required]
    public DateTime PeriodStart { get; set; }
    
    [Required]
    public DateTime PeriodEnd { get; set; }
    
    [Required]
    [StringLength(5000, MinimumLength = 10)]
    public string Content { get; set; } = "";
    
    public bool SubmitToSuperior { get; set; } = false;
}

public class UpdateWorkplanDto
{
    [Required]
    public DateTime PeriodStart { get; set; }
    
    [Required]
    public DateTime PeriodEnd { get; set; }
    
    [Required]
    [StringLength(5000, MinimumLength = 10)]
    public string Content { get; set; } = "";
}
            