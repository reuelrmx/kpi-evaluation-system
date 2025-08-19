using KpiApi.Models;
using Microsoft.AspNetCore.Identity;

namespace KpiApi.Data;

public static class Seed
{
    public static async Task Run(IServiceProvider sp)
    {
        var roles = new[] { "Admin", "Lecturer", "HOD", "Dean", "Registrar" };

        using var scope = sp.CreateScope();
        var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var r in roles)
            if (!await roleMgr.RoleExistsAsync(r))
                await roleMgr.CreateAsync(new IdentityRole(r));

        var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var adminEmail = "admin@kpi.local";
        var admin = await userMgr.FindByNameAsync(adminEmail);
        if (admin == null)
        {
            admin = new AppUser { UserName = adminEmail, Email = adminEmail, FullName = "System Admin" };
            await userMgr.CreateAsync(admin, "Admin123!");
            await userMgr.AddToRoleAsync(admin, "Admin");
        }
    }
}
