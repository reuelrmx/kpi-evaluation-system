using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "HOD")]
public class EvaluationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public EvaluationsController(AppDbContext db) => _db = db;

    public record EvalDto(string LecturerId, int KpiId, decimal Score, string? Comments);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EvalDto dto)
    {
        var hodId = User.Claims.First(c => c.Type.Contains("nameidentifier")).Value;
        var e = new Evaluation { LecturerId = dto.LecturerId, HodId = hodId, KpiId = dto.KpiId, Score = dto.Score, Comments = dto.Comments };
        _db.Evaluations.Add(e);
        await _db.SaveChangesAsync();
        return Ok(e);
    }
}