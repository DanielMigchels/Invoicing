using System.ComponentModel.DataAnnotations;

namespace Invoicing.API.Services.Companies.Models;

public class UpdateCompanyRequestModel
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Street { get; set; } = string.Empty;

    [Required]
    public string HouseNumber { get; set; } = string.Empty;

    [Required]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = "Nederland";

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string BankAccountNumber { get; set; } = string.Empty;

    public string? ChamberOfCommerceNumber { get; set; }
    public string? VatNumber { get; set; }
}
