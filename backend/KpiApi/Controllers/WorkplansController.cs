using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkplansController : ControllerBase
{
    private readonly AppDbContext _db;
    public WorkplansController(AppDbContext db) => _db = db;

    [HttpPost]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> Submit([FromBody] Workplan wp)
    {
        // Enforce current user as owner
        var uid = User.Claims.First(c => c.Type.Contains("nameidentifier")).Value;
        wp.LecturerId = uid;
        _db.Workplans.Add(wp);
        await _db.SaveChangesAsync();
        return Ok(wp);
    }

    [HttpGet]
    [Authorize(Roles = "HOD")]
    public async Task<IActionResult> List([FromQuery] string? lecturerId = null)
    {
        var q = _db.Workplans.AsQueryable();
        if (!string.IsNullOrEmpty(lecturerId)) q = q.Where(w => w.LecturerId == lecturerId);
        return Ok(await q.OrderByDescending(w => w.SubmittedAt).ToListAsync());
    }
}