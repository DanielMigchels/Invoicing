using System.ComponentModel.DataAnnotations;

namespace Invoicing.API.Services.Invoices.Models;

public class CreateInvoiceRequestModel
{
    [Required]
    public string InvoiceNumber { get; set; } = string.Empty;

    [Required]
    public DateOnly InvoiceDate { get; set; }

    [Required]
    public DateOnly DueDate { get; set; }

    [Required]
    public Guid CompanyId { get; set; }

    [Required]
    public Guid CustomerId { get; set; }

    [Required]
    public string Currency { get; set; } = "EUR";

    public string? VatExemptionReason { get; set; }
    public string? PaymentReference { get; set; }
    public string? Notes { get; set; }
}
