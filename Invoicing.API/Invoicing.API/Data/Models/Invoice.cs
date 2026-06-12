namespace Invoicing.API.Data.Models;

public class Invoice
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
