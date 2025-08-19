namespace KpiApi.Models;

public class KpiAssignment
{
    public int Id { get; set; }
    public int KpiId { get; set; }
    public Kpi? Kpi { get; set; }

    public string LecturerId { get; set; } = "";
    public AppUser? Lecturer { get; set; }

    public string AcademicYear { get; set; } = "";
    public string Semester { get; set; } = ""; // e.g., "1" or "2"
}
