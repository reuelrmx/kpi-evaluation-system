using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HOD")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db) => _db = db;

    [HttpGet("lecturers")]
    public async Task<IActionResult> GetLecturers() =>
        Ok(await _db.Users.Where(u => _db.UserRoles.Any(ur => ur.UserId == u.Id)).ToListAsync());

    // POST/PUT/DELETE endpoints to add/edit/delete lecturers
}
