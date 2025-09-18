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
public class WorkplanAssignmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public WorkplanAssignmentsController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // GET: api/workplanassignments/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAssignments()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var assignments = await _db.WorkplanAssignments
            .Include(wa => wa.StandardWorkplan)
            .Include(wa => wa.AssignedBy)
            .Where(wa => wa.AssigneeId == currentUserId && wa.IsActive)
            .OrderByDescending(wa => wa.AssignedAt)
            .Select(wa => new
            {
                wa.Id,
                wa.Status,
                wa.Progress,
                wa.AssignedAt,
                wa.StartedAt,
                wa.CompletedAt,
                wa.ReviewedAt,
                wa.AssignmentNotes,
                wa.CompletionNotes,
                wa.ReviewFeedback,
                StandardWorkplan = new
                {
                    wa.StandardWorkplan.Id,
                    wa.StandardWorkplan.Title,
                    wa.StandardWorkplan.Description,
                    wa.StandardWorkplan.AcademicYear,
                    wa.StandardWorkplan.Semester,
                    wa.StandardWorkplan.TargetRole,
                    wa.StandardWorkplan.TeachingActivities,
                    wa.StandardWorkplan.ResearchActivities,
                    wa.StandardWorkplan.ServiceActivities,
                    wa.StandardWorkplan.AdministrativeActivities,
                    wa.StandardWorkplan.ProfessionalDevelopment,
                    wa.StandardWorkplan.Objectives,
                    wa.StandardWorkplan.ExpectedOutcomes
                },
                AssignedBy = wa.AssignedBy.FullName
            })
            .ToListAsync();

        return Ok(assignments);
    }

    // GET: api/workplanassignments/assigned-by-me
    [HttpGet("assigned-by-me")]
    [Authorize(Roles = "Dean,HOD")]
    public async Task<IActionResult> GetAssignedByMe()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var assignments = await _db.WorkplanAssignments
            .Include(wa => wa.StandardWorkplan)
            .Include(wa => wa.Assignee)
                .ThenInclude(a => a.Department)
            .Where(wa => wa.AssignedById == currentUserId && wa.IsActive)
            .OrderByDescending(wa => wa.AssignedAt)
            .Select(wa => new
            {
                wa.Id,
                wa.Status,
                wa.Progress,
                wa.AssignedAt,
                wa.StartedAt,
                wa.CompletedAt,
                wa.ReviewedAt,
                wa.AssignmentNotes,
                wa.CompletionNotes,
                wa.ReviewFeedback,
                StandardWorkplan = new
                {
                    wa.StandardWorkplan.Id,
                    wa.StandardWorkplan.Title,
                    wa.StandardWorkplan.AcademicYear,
                    wa.StandardWorkplan.Semester
                },
                Assignee = new
                {
                    wa.Assignee.Id,
                    wa.Assignee.FullName,
                    wa.Assignee.Email,
                    Department = wa.Assignee.Department != null ? wa.Assignee.Department.Name : null
                }
            })
            .ToListAsync();

        return Ok(assignments);
    }

    // POST: api/workplanassignments/assign
    [HttpPost("assign")]
    [Authorize(Roles = "Dean,HOD")]
    public async Task<IActionResult> AssignWorkplan([FromBody] AssignWorkplanDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId!);
        var userRoles = await _userManager.GetRolesAsync(currentUser!);
        var currentRole = userRoles.FirstOrDefault();

        // Verify the standard workplan exists
        var standardWorkplan = await _db.StandardWorkplans.FindAsync(dto.StandardWorkplanId);
        if (standardWorkplan == null || !standardWorkplan.IsActive)
            return StatusCode(404, new { message = "Standard workplan not found" });

        // Verify the assignee exists and has the correct role
        var assignee = await _userManager.FindByIdAsync(dto.AssigneeId);
        if (assignee == null)
            return StatusCode(404, new { message = "Assignee not found" });

        var assigneeRoles = await _userManager.GetRolesAsync(assignee);
        var assigneeRole = assigneeRoles.FirstOrDefault();

        // Validate hierarchy and permissions
        var canAssign = (currentRole, assigneeRole, standardWorkplan.TargetRole) switch
        {
            ("Dean", "HOD", "HOD") => true,
            ("HOD", "Lecturer", "Lecturer") => true,
            _ => false
        };

        if (!canAssign)
            return StatusCode(403, new { message = "You cannot assign this workplan to this user" });

        // For HODs, verify the lecturer is in their department
        if (currentRole == "HOD" && currentUser.DepartmentId != assignee.DepartmentId)
            return StatusCode(403, new { message = "You can only assign workplans to lecturers in your department" });

        // Check if assignment already exists
        var existingAssignment = await _db.WorkplanAssignments
            .FirstOrDefaultAsync(wa => wa.StandardWorkplanId == dto.StandardWorkplanId 
                                    && wa.AssigneeId == dto.AssigneeId 
                                    && wa.IsActive);

        if (existingAssignment != null)
            return StatusCode(409, new { message = "This workplan is already assigned to this user" });

        // Create the assignment
        var assignment = new WorkplanAssignment
        {
            StandardWorkplanId = dto.StandardWorkplanId,
            AssigneeId = dto.AssigneeId,
            AssignedById = currentUserId!,
            AssignmentNotes = dto.AssignmentNotes,
            Status = "Assigned"
        };

        _db.WorkplanAssignments.Add(assignment);
        await _db.SaveChangesAsync();

        // Return the created assignment with details
        var result = await _db.WorkplanAssignments
            .Include(wa => wa.StandardWorkplan)
            .Include(wa => wa.Assignee)
            .FirstOrDefaultAsync(wa => wa.Id == assignment.Id);

        return Ok(result);
    }

    // POST: api/workplanassignments/bulk-assign
    [HttpPost("bulk-assign")]
    [Authorize(Roles = "Dean,HOD")]
    public async Task<IActionResult> BulkAssignWorkplan([FromBody] BulkAssignWorkplanDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId!);
        var userRoles = await _userManager.GetRolesAsync(currentUser!);
        var currentRole = userRoles.FirstOrDefault();

        // Verify the standard workplan exists
        var standardWorkplan = await _db.StandardWorkplans.FindAsync(dto.StandardWorkplanId);
        if (standardWorkplan == null || !standardWorkplan.IsActive)
            return NotFound("Standard workplan not found");

        var assignments = new List<WorkplanAssignment>();
        var errors = new List<string>();

        foreach (var assigneeId in dto.AssigneeIds)
        {
            // Check if assignment already exists
            var existingAssignment = await _db.WorkplanAssignments
                .FirstOrDefaultAsync(wa => wa.StandardWorkplanId == dto.StandardWorkplanId 
                                        && wa.AssigneeId == assigneeId 
                                        && wa.IsActive);

            if (existingAssignment != null)
            {
                errors.Add($"Workplan already assigned to user {assigneeId}");
                continue;
            }

            // Verify the assignee exists and has the correct role
            var assignee = await _userManager.FindByIdAsync(assigneeId);
            if (assignee == null)
            {
                errors.Add($"User {assigneeId} not found");
                continue;
            }

            var assigneeRoles = await _userManager.GetRolesAsync(assignee);
            var assigneeRole = assigneeRoles.FirstOrDefault();

            // Validate hierarchy and permissions
            var canAssign = (currentRole, assigneeRole, standardWorkplan.TargetRole) switch
            {
                ("Dean", "HOD", "HOD") => true,
                ("HOD", "Lecturer", "Lecturer") => true,
                _ => false
            };

            if (!canAssign)
            {
                errors.Add($"Cannot assign workplan to {assignee.FullName} ({assigneeRole})");
                continue;
            }

            // For HODs, verify the lecturer is in their department
            if (currentRole == "HOD" && currentUser.DepartmentId != assignee.DepartmentId)
            {
                errors.Add($"Cannot assign to {assignee.FullName} - not in your department");
                continue;
            }

            assignments.Add(new WorkplanAssignment
            {
                StandardWorkplanId = dto.StandardWorkplanId,
                AssigneeId = assigneeId,
                AssignedById = currentUserId!,
                AssignmentNotes = dto.AssignmentNotes,
                Status = "Assigned"
            });
        }

        if (assignments.Count > 0)
        {
            _db.WorkplanAssignments.AddRange(assignments);
            await _db.SaveChangesAsync();
        }

        return Ok(new
        {
            AssignedCount = assignments.Count,
            Errors = errors,
            Message = $"Successfully assigned workplan to {assignments.Count} users"
        });
    }

    // PUT: api/workplanassignments/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var assignment = await _db.WorkplanAssignments
            .Include(wa => wa.Assignee)
            .Include(wa => wa.AssignedBy)
            .FirstOrDefaultAsync(wa => wa.Id == id && wa.IsActive);

        if (assignment == null)
            return NotFound();

        // Check permissions - assignee can update their own status, supervisor can review
        var canUpdate = assignment.AssigneeId == currentUserId || assignment.AssignedById == currentUserId;
        if (!canUpdate)
            return Forbid("You cannot update this assignment");

        // Update status and timestamps
        assignment.Status = dto.Status;
        assignment.Progress = dto.Progress ?? assignment.Progress;

        switch (dto.Status.ToLower())
        {
            case "inprogress":
                if (assignment.StartedAt == null)
                    assignment.StartedAt = DateTime.UtcNow;
                break;
            case "completed":
                if (assignment.CompletedAt == null)
                    assignment.CompletedAt = DateTime.UtcNow;
                assignment.CompletionNotes = dto.Notes;
                break;
            case "reviewed":
                if (assignment.ReviewedAt == null)
                    assignment.ReviewedAt = DateTime.UtcNow;
                assignment.ReviewFeedback = dto.Notes;
                break;
        }

        await _db.SaveChangesAsync();
        return Ok(assignment);
    }

    // DELETE: api/workplanassignments/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Dean,HOD")]
    public async Task<IActionResult> RemoveAssignment(int id)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var assignment = await _db.WorkplanAssignments.FindAsync(id);

        if (assignment == null || !assignment.IsActive)
            return NotFound();

        // Only the person who assigned can remove the assignment
        if (assignment.AssignedById != currentUserId)
            return Forbid("You can only remove assignments you created");

        // Soft delete
        assignment.IsActive = false;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Assignment removed successfully" });
    }
}

// DTOs for WorkplanAssignment
public class AssignWorkplanDto
{
    [Required]
    public int StandardWorkplanId { get; set; }

    [Required]
    public string AssigneeId { get; set; } = "";

    public string? AssignmentNotes { get; set; }
}

public class BulkAssignWorkplanDto
{
    [Required]
    public int StandardWorkplanId { get; set; }

    [Required]
    [MinLength(1)]
    public List<string> AssigneeIds { get; set; } = new();

    public string? AssignmentNotes { get; set; }
}

public class UpdateStatusDto
{
    [Required]
    public string Status { get; set; } = "";

    public int? Progress { get; set; }

    public string? Notes { get; set; }
}