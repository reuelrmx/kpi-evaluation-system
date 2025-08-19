using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KpisController : ControllerBase
{
    private readonly AppDbContext _db;
    public KpisController(AppDbContext db) => _db = db;

    [HttpPost]
    [Authorize(Roles = "HOD")]
    public async Task<IActionResult> CreateKpi([FromBody] Kpi kpi)
    {
        _db.Kpis.Add(kpi);
        await _db.SaveChangesAsync();
        return Ok(kpi);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Lecturer")]
    public async Task<IActionResult> MyKpis()
    {
        var uid = User.Claims.First(c => c.Type == "nameidentifier" || c.Type.Contains("nameidentifier")).Value;
        var list = await _db.KpiAssignments
            .Include(a => a.Kpi)
            .Where(a => a.LecturerId == uid)
            .Select(a => a.Kpi!)
            .ToListAsync();
        return Ok(list);
    }
}