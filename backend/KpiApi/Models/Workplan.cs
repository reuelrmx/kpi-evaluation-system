namespace KpiApi.Models;

public class Workplan
{
    public int Id { get; set; }
    public string LecturerId { get; set; } = "";
    public AppUser? Lecturer { get; set; }

    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string Content { get; set; } = ""; // JSON or text
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    // Fields to support hierarchical approval workflow
    public string? SubmittedToId { get; set; } // ID of the person this workplan is submitted to (Admin for Dean, Dean for HOD, HOD for Lecturer)
    public AppUser? SubmittedTo { get; set; }
    
    public string Status { get; set; } = "Draft"; // Draft, Submitted, Approved, Rejected
    public string? ReviewComments { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
