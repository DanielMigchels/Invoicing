using System.ComponentModel.DataAnnotations;

namespace Invoicing.API.Services.InvoiceLines.Models;

public class CreateInvoiceLineRequestModel
{
    [Required]
    public string Description { get; set; } = string.Empty;

    [Required, Range(0.001, double.MaxValue)]
    public decimal Quantity { get; set; } = 1m;

    [Required]
    public string Unit { get; set; } = "st";

    [Required]
    public decimal UnitPrice { get; set; }

    public decimal DiscountAmount { get; set; }

    [Required, Range(0, 100)]
    public decimal VatPercentage { get; set; }

    [Required]
    public decimal Total { get; set; }
}
