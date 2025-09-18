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
        
        // Create sample HODs and additional users
        await SeedSampleUsers(context, userManager);
        
        // Seed standard workplans
        await SeedStandardWorkplans(context);
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
    
    private static async Task SeedStandardWorkplans(AppDbContext context)
    {
        if (!context.StandardWorkplans.Any())
        {
            var standardWorkplans = new[]
            {
                new StandardWorkplan
                {
                    Title = "HOD Academic Leadership Plan 2024/2025",
                    Description = "Comprehensive workplan for HOD responsibilities including department management, academic oversight, and strategic planning.",
                    AcademicYear = "2024/2025",
                    Semester = "Full Year",
                    TargetRole = "HOD",
                    TeachingActivities = "Oversee teaching quality, curriculum development, and faculty development programs. Monitor course delivery and student satisfaction.",
                    ResearchActivities = "Promote departmental research initiatives, supervise postgraduate students, and facilitate research collaborations.",
                    ServiceActivities = "Lead department meetings, participate in faculty committees, and represent department in university forums.",
                    AdministrativeActivities = "Manage department budget, oversee staff recruitment, conduct performance reviews, and handle student affairs.",
                    ProfessionalDevelopment = "Attend leadership workshops, pursue advanced qualifications, and participate in academic conferences.",
                    Objectives = "1. Improve departmental ranking\n2. Increase research output\n3. Enhance student satisfaction\n4. Develop staff capabilities",
                    ExpectedOutcomes = "Improved department performance, increased research publications, better student outcomes, and enhanced staff satisfaction.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new StandardWorkplan
                {
                    Title = "Lecturer Teaching & Research Plan 2024/2025",
                    Description = "Standard workplan for lecturers focusing on teaching excellence, research productivity, and service contributions.",
                    AcademicYear = "2024/2025",
                    Semester = "Full Year",
                    TargetRole = "Lecturer",
                    TeachingActivities = "Deliver assigned courses effectively, develop course materials, assess student learning, and provide academic guidance.",
                    ResearchActivities = "Conduct research in area of specialization, publish research findings, and supervise student projects.",
                    ServiceActivities = "Participate in departmental committees, contribute to curriculum review, and engage in community outreach.",
                    AdministrativeActivities = "Maintain accurate records, participate in faculty meetings, and contribute to quality assurance processes.",
                    ProfessionalDevelopment = "Attend training workshops, pursue professional certifications, and engage in peer learning activities.",
                    Objectives = "1. Achieve excellent teaching ratings\n2. Publish research papers\n3. Complete assigned service tasks\n4. Enhance professional skills",
                    ExpectedOutcomes = "High teaching effectiveness, quality research output, meaningful service contributions, and continuous professional growth.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new StandardWorkplan
                {
                    Title = "Semester 1 Teaching Focus Plan 2024/2025",
                    Description = "Focused workplan for lecturers during the first semester with emphasis on course delivery and student engagement.",
                    AcademicYear = "2024/2025",
                    Semester = "1",
                    TargetRole = "Lecturer",
                    TeachingActivities = "Prepare and deliver lectures, conduct tutorials, grade assignments, and provide student feedback for semester 1 courses.",
                    ResearchActivities = "Continue ongoing research projects, prepare research proposals, and analyze data from current studies.",
                    ServiceActivities = "Participate in orientation programs, contribute to recruitment activities, and serve on assigned committees.",
                    AdministrativeActivities = "Update course outlines, maintain attendance records, and prepare semester reports.",
                    ProfessionalDevelopment = "Attend semester training sessions, participate in teaching excellence workshops, and engage in peer observations.",
                    Objectives = "1. Complete semester 1 teaching requirements\n2. Maintain research momentum\n3. Support new student integration\n4. Improve teaching methods",
                    ExpectedOutcomes = "Successful completion of semester 1 courses, continued research progress, effective student support, and enhanced teaching skills.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new StandardWorkplan
                {
                    Title = "HOD Strategic Planning 2024/2025",
                    Description = "Strategic workplan for HODs focusing on long-term departmental development and innovation.",
                    AcademicYear = "2024/2025",
                    Semester = "Full Year",
                    TargetRole = "HOD",
                    TeachingActivities = "Oversee curriculum innovation, promote active learning methodologies, and ensure quality teaching standards.",
                    ResearchActivities = "Develop research strategy, secure research funding, and establish industry partnerships for research collaboration.",
                    ServiceActivities = "Lead strategic planning committees, participate in university governance, and engage with external stakeholders.",
                    AdministrativeActivities = "Develop department policies, manage resource allocation, and oversee infrastructure development.",
                    ProfessionalDevelopment = "Participate in leadership development programs, attend international conferences, and build professional networks.",
                    Objectives = "1. Develop 5-year strategic plan\n2. Secure external funding\n3. Establish industry partnerships\n4. Enhance department reputation",
                    ExpectedOutcomes = "Clear strategic direction, increased funding opportunities, stronger industry connections, and improved department visibility.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };
            
            context.StandardWorkplans.AddRange(standardWorkplans);
            await context.SaveChangesAsync();
        }
    }
}
