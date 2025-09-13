using KpiApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Data;

public static class DbSeeder
{
    public static async Task SeedRolesAndUsers(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
        var context = serviceProvider.GetRequiredService<AppDbContext>();
        
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Create roles
        string[] roles = { "Admin", "Dean", "HOD", "Lecturer" };
        foreach (string role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
        
        // Seed departments first
        await SeedDepartments(context);

        // Create admin user
        string adminEmail = "admin@cbu.ac.zm";
        string adminPassword = "admin1234";

        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Administrator",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Create dean user
        string deanEmail = "dean@cbu.ac.zm";
        string deanPassword = "dean1234";

        if (await userManager.FindByEmailAsync(deanEmail) == null)
        {
            var deanUser = new AppUser
            {
                UserName = deanEmail,
                Email = deanEmail,
                FullName = "Dean of School of ICT",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(deanUser, deanPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(deanUser, "Dean");
            }
        }

        // Create sample HODs and additional users
        await SeedSampleUsers(context, userManager);
    }
    
    private static async Task SeedDepartments(AppDbContext context)
    {
        if (!context.Departments.Any())
        {
            var departments = new[]
            {
                new Department { Name = "Computer Science" },
                new Department { Name = "Computer Engineering" },
                new Department { Name = "Information Systems" }
            };
            
            context.Departments.AddRange(departments);
            await context.SaveChangesAsync();
        }
    }
    
    private static async Task SeedSampleUsers(AppDbContext context, UserManager<AppUser> userManager)
    {
        var departments = await context.Departments.ToListAsync();
        if (!departments.Any()) return;
        
        // Create HODs for each department
        var hodData = new[]
        {
            new { Email = "hod.cs@cbu.ac.zm", Name = "Dr. Computer Science HOD", DeptId = departments.First(d => d.Name == "Computer Science").Id },
            new { Email = "hod.ce@cbu.ac.zm", Name = "Dr. Computer Engineering HOD", DeptId = departments.First(d => d.Name == "Computer Engineering").Id },
            new { Email = "hod.is@cbu.ac.zm", Name = "Dr. Information Systems HOD", DeptId = departments.First(d => d.Name == "Information Systems").Id }
        };
        
        foreach (var hod in hodData)
        {
            if (await userManager.FindByEmailAsync(hod.Email) == null)
            {
                var hodUser = new AppUser
                {
                    UserName = hod.Email,
                    Email = hod.Email,
                    FullName = hod.Name,
                    DepartmentId = hod.DeptId,
                    EmailConfirmed = true
                };
                
                var result = await userManager.CreateAsync(hodUser, "hod1234");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(hodUser, "HOD");
                }
            }
        }
        
        // Create additional lecturers
        var lecturerData = new[]
        {
            new { Email = "lecturer1@cbu.ac.zm", Name = "Dr. Jane Smith", DeptId = departments.First(d => d.Name == "Computer Science").Id },
            new { Email = "lecturer2@cbu.ac.zm", Name = "Dr. John Doe", DeptId = departments.First(d => d.Name == "Computer Engineering").Id },
            new { Email = "lecturer3@cbu.ac.zm", Name = "Dr. Alice Johnson", DeptId = departments.First(d => d.Name == "Information Systems").Id }
        };
        
        foreach (var lecturer in lecturerData)
        {
            if (await userManager.FindByEmailAsync(lecturer.Email) == null)
            {
                var lecturerUser = new AppUser
                {
                    UserName = lecturer.Email,
                    Email = lecturer.Email,
                    FullName = lecturer.Name,
                    DepartmentId = lecturer.DeptId,
                    EmailConfirmed = true
                };
                
                var result = await userManager.CreateAsync(lecturerUser, "lecturer1234");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(lecturerUser, "Lecturer");
                }
            }
        }
    }
}
