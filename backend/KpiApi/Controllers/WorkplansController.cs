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

            // Validate period dates
            if (dto.PeriodEnd <= dto.PeriodStart)
            {
                return BadRequest(new { message = "Period end date must be after start date" });
            }

            var workplan = new Workplan
            {
                LecturerId = currentUserId,
                PeriodStart = dto.PeriodStart,
                PeriodEnd = dto.PeriodEnd,
                Content = dto.Content
            };

            _db.Workplans.Add(workplan);
            await _db.SaveChangesAsync();

            // Return workplan with lecturer details
            var result = await _db.Workplans
                .Include(w => w.Lecturer)
                .ThenInclude(l => l.Department)
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
                .Where(w => w.LecturerId == currentUserId)
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
            