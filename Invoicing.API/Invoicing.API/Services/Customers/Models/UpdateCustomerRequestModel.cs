using System.ComponentModel.DataAnnotations;

namespace Invoicing.API.Services.Customers.Models;

public class UpdateCustomerRequestModel
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

    public string? ContactPerson { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }
    public string? VatNumber { get; set; }
}
