using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using KpiApi.Models;

namespace KpiApi.Data;

// This file defines the application's database context, which includes the DbSet properties for each model.
// It inherits from IdentityDbContext to integrate with ASP.NET Core Identity for user management.
public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Kpi> Kpis => Set<Kpi>();
    public DbSet<KpiAssignment> KpiAssignments => Set<KpiAssignment>();
    public DbSet<Workplan> Workplans => Set<Workplan>();
    public DbSet<Evaluation> Evaluations => Set<Evaluation>();
}