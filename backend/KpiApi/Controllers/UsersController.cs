
using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<AppUser> _userManager;

        public UsersController(AppDbContext db, UserManager<AppUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet("lecturers")]
        [Authorize(Roles = "Admin,HOD")]
        public async Task<IActionResult> GetLecturers()
        {
            var lecturers = await _userManager.GetUsersInRoleAsync("Lecturer");
            var lecturerList = lecturers.Select(u => new
            {
                id = u.Id,
                fullName = u.FullName,
                email = u.Email,
                departmentId = u.DepartmentId,
                department = u.Department?.Name
            });
            
            return Ok(lecturerList);
        }

        [HttpGet("hods")]
        [Authorize(Roles = "Admin,Dean")]
        public async Task<IActionResult> GetHODs()
        {
            var hods = await _userManager.GetUsersInRoleAsync("HOD");
            var hodList = hods.Select(u => new
            {
                id = u.Id,
                fullName = u.FullName,
                email = u.Email,
                departmentId = u.DepartmentId,
                department = u.Department?.Name
            });
            
            return Ok(hodList);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,HOD,Dean")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .Include(u => u.Department)
                .ToListAsync();

            var result = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    departmentId = user.DepartmentId,
                    department = user.Department?.Name,
                    roles
                });
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _db.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == id);
                
            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            
            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                departmentId = user.DepartmentId,
                department = user.Department?.Name,
                roles
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HOD")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            user.FullName = model.FullName;
            user.DepartmentId = model.DepartmentId;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User deleted successfully" });
        }
    }

    public class UpdateUserModel
    {
        public string FullName { get; set; } = "";
        public int? DepartmentId { get; set; }
    }
}
