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
    public DbSet<StandardWorkplan> StandardWorkplans => Set<StandardWorkplan>();
    public DbSet<WorkplanAssignment> WorkplanAssignments => Set<WorkplanAssignment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure AppUser relationships
        builder.Entity<AppUser>()
            .HasOne(u => u.Department)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure Department
        builder.Entity<Department>()
            .HasIndex(d => d.Name)
            .IsUnique();



        builder.Entity<Kpi>()
            .HasOne(k => k.CreatedByHod)
            .WithMany()
            .HasForeignKey(k => k.CreatedByHodId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Kpi>()
            .Property(k => k.Weight)
            .HasPrecision(5, 4); // Allows values like 0.1234

        // Configure KPI Assignment relationships
        builder.Entity<KpiAssignment>()
            .HasOne(ka => ka.Kpi)
            .WithMany()
            .HasForeignKey(ka => ka.KpiId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<KpiAssignment>()
            .HasOne(ka => ka.Lecturer)
            .WithMany()
            .HasForeignKey(ka => ka.LecturerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ensure unique assignment per period
        builder.Entity<KpiAssignment>()
            .HasIndex(ka => new { ka.KpiId, ka.LecturerId, ka.AcademicYear, ka.Semester })
            .IsUnique();

        // Configure Evaluation relationships
        builder.Entity<Evaluation>()
            .HasOne(e => e.Lecturer)
            .WithMany()
            .HasForeignKey(e => e.LecturerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Evaluation>()
            .HasOne(e => e.Hod)
            .WithMany()
            .HasForeignKey(e => e.HodId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Evaluation>()
            .HasOne(e => e.Kpi)
            .WithMany()
            .HasForeignKey(e => e.KpiId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Evaluation>()
            .Property(e => e.Score)
            .HasPrecision(5, 2); // Allows values like 100.00

        // Configure Workplan relationships
        builder.Entity<Workplan>()
            .HasOne(w => w.Lecturer)
            .WithMany()
            .HasForeignKey(w => w.LecturerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Add indexes for better performance
        builder.Entity<KpiAssignment>()
            .HasIndex(ka => ka.LecturerId);

        builder.Entity<KpiAssignment>()
            .HasIndex(ka => ka.KpiId);

        builder.Entity<Evaluation>()
            .HasIndex(e => e.LecturerId);

        builder.Entity<Evaluation>()
            .HasIndex(e => e.EvaluatedAt);

        builder.Entity<Workplan>()
            .HasIndex(w => w.LecturerId);

        builder.Entity<Workplan>()
            .HasIndex(w => w.SubmittedAt);

        // Configure StandardWorkplan relationships
        builder.Entity<StandardWorkplan>()
            .HasOne(sw => sw.CreatedBy)
            .WithMany()
            .HasForeignKey(sw => sw.CreatedById)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<StandardWorkplan>()
            .HasIndex(sw => sw.TargetRole);

        builder.Entity<StandardWorkplan>()
            .HasIndex(sw => new { sw.AcademicYear, sw.Semester });

        // Configure WorkplanAssignment relationships
        builder.Entity<WorkplanAssignment>()
            .HasOne(wa => wa.StandardWorkplan)
            .WithMany(sw => sw.WorkplanAssignments)
            .HasForeignKey(wa => wa.StandardWorkplanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<WorkplanAssignment>()
            .HasOne(wa => wa.Assignee)
            .WithMany()
            .HasForeignKey(wa => wa.AssigneeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<WorkplanAssignment>()
            .HasOne(wa => wa.AssignedBy)
            .WithMany()
            .HasForeignKey(wa => wa.AssignedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Ensure unique assignment per user per workplan
        builder.Entity<WorkplanAssignment>()
            .HasIndex(wa => new { wa.StandardWorkplanId, wa.AssigneeId })
            .IsUnique();

        // Add indexes for better performance
        builder.Entity<WorkplanAssignment>()
            .HasIndex(wa => wa.AssigneeId);

        builder.Entity<WorkplanAssignment>()
            .HasIndex(wa => wa.AssignedById);

        builder.Entity<WorkplanAssignment>()
            .HasIndex(wa => wa.Status);

        builder.Entity<WorkplanAssignment>()
            .HasIndex(wa => wa.AssignedAt);
    }
}
