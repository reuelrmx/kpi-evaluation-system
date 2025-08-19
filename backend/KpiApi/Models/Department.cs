namespace KpiApi.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public ICollection<AppUser> Users { get; set; } = new List<AppUser>();
}
