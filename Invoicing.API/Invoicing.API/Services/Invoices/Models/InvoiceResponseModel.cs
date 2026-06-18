namespace Invoicing.API.Services.Invoices.Models;

public class InvoiceResponseModel
{
    public Guid Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateOnly InvoiceDate { get; set; }
    public DateOnly DueDate { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public decimal TotalExcludingVat { get; set; }
    public decimal VatAmount { get; set; }
    public decimal TotalIncludingVat { get; set; }
    public string? VatExemptionReason { get; set; }
    public string? PaymentReference { get; set; }
    public string? Notes { get; set; }
}
