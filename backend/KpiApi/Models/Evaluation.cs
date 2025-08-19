namespace KpiApi.Models;

public class Evaluation
{
    public int Id { get; set; }

    public string LecturerId { get; set; } = "";
    public AppUser? Lecturer { get; set; }

    public string HodId { get; set; } = "";
    public AppUser? Hod { get; set; }

    public int KpiId { get; set; }
    public Kpi? Kpi { get; set; }

    public decimal Score { get; set; } // 0..100
    public string? Comments { get; set; }
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;
}
