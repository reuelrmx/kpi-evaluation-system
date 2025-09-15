namespace KpiApi.Models;

public class Kpi
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public decimal Weight { get; set; } // 0..1 or percentage
    public string CreatedByHodId { get; set; } = "";
    public AppUser? CreatedByHod { get; set; }
}
