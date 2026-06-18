namespace Invoicing.API.Data.Models;

public class InvoiceLine
{
    public Guid Id { get; set; }

    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;

    public string Description { get; set; } = string.Empty;

    public decimal Quantity { get; set; } = 1m;

    public string? Unit { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal VatPercentage { get; set; }

    public decimal Total { get; set; }
}