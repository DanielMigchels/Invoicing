namespace Invoicing.API.Services.InvoiceLines.Models;

public class InvoiceLineResponseModel
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal VatPercentage { get; set; }
    public decimal Total { get; set; }
}
