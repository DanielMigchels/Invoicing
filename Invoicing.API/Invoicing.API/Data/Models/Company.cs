namespace Invoicing.API.Data.Models;

public class Company
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;
    public string HouseNumber { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = "Nederland";

    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    public string BankAccountNumber { get; set; } = string.Empty;

    public string? ChamberOfCommerceNumber { get; set; }
    public string? VatNumber { get; set; }
}