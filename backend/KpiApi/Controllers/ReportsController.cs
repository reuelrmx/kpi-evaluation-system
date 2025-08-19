using KpiApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "HOD,Dean,Registrar")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    [HttpGet("department")]
    public async Task<IActionResult> Department()
    {
        var summary = await _db.Evaluations
            .GroupBy(e => e.LecturerId)
            .Select(g => new { LecturerId = g.Key, AvgScore = g.Average(x => x.Score), Count = g.Count() })
            .ToListAsync();
        return Ok(summary);
    }
}