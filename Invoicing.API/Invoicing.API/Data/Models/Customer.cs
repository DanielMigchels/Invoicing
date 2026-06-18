namespace Invoicing.API.Data.Models;

public class Customer
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;
    public string HouseNumber { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = "Nederland";

    public string? ContactPerson { get; set; }

    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    public string? VatNumber { get; set; }
}