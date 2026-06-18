namespace Invoicing.API.Data.Models;

public class Invoice
{
    public Guid Id { get; set; }

    public User? User { get; set; }
    public string UserId { get; set; } = string.Empty;

    public string InvoiceNumber { get; set; } = string.Empty;

    public DateOnly InvoiceDate { get; set; }
    public DateOnly DueDate { get; set; }

    public Guid CompanyId { get; set; }
    public Guid CustomerId { get; set; }

    public Company Company { get; set; } = null!;
    public Customer Customer { get; set; } = null!;

    public string Currency { get; set; } = "EUR";

    public string? VatExemptionReason { get; set; }

    public string? PaymentReference { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = [];
}
