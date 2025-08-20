using KpiApi.Models;
using Microsoft.AspNetCore.Identity;

namespace KpiApi.Data;

public static class DbSeeder
{
    public static async Task SeedRolesAndUsers(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

        // Create roles
        string[] roles = { "Admin", "HOD", "Lecturer" };
        foreach (string role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

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

        // Create test lecturer
        string lecturerEmail = "lecturer@cbu.ac.zm";
        string lecturerPassword = "test1234";

        if (await userManager.FindByEmailAsync(lecturerEmail) == null)
        {
            var lecturerUser = new AppUser
            {
                UserName = lecturerEmail,
                Email = lecturerEmail,
                FullName = "Test Lecturer",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(lecturerUser, lecturerPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(lecturerUser, "Lecturer");
            }
        }
    }
}