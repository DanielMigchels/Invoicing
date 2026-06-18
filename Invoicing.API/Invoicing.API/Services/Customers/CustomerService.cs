using Invoicing.API.Data;
using Invoicing.API.Data.Models;
using Invoicing.API.Services.Customers.Models;
using Invoicing.API.Services.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.API.Services.Customers;

public class CustomerService(DatabaseContext databaseContext) : ICustomerService
{
    public async Task<PaginatedList<CustomerResponseModel>> GetAll(string userId, int page, int pageSize)
    {
        var query = databaseContext.Customers.Where(c => c.UserId == userId);
        var total = await query.CountAsync();

        var data = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => MapToResponse(c))
            .ToListAsync();

        return new PaginatedList<CustomerResponseModel>
        {
            Page = page,
            PageSize = pageSize,
            HasPrevious = page > 1,
            HasNext = page * pageSize < total,
            Data = data
        };
    }

    public async Task<CustomerResponseModel?> GetById(string userId, Guid id)
    {
        var customer = await databaseContext.Customers
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        return customer == null ? null : MapToResponse(customer);
    }

    public async Task<CustomerResponseModel> Create(string userId, CreateCustomerRequestModel model)
    {
        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = model.Name,
            Street = model.Street,
            HouseNumber = model.HouseNumber,
            PostalCode = model.PostalCode,
            City = model.City,
            Country = model.Country,
            ContactPerson = model.ContactPerson,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            VatNumber = model.VatNumber
        };

        databaseContext.Customers.Add(customer);
        await databaseContext.SaveChangesAsync();
        return MapToResponse(customer);
    }

    public async Task<bool> Update(string userId, Guid id, UpdateCustomerRequestModel model)
    {
        var customer = await databaseContext.Customers
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        if (customer == null) return false;

        customer.Name = model.Name;
        customer.Street = model.Street;
        customer.HouseNumber = model.HouseNumber;
        customer.PostalCode = model.PostalCode;
        customer.City = model.City;
        customer.Country = model.Country;
        customer.ContactPerson = model.ContactPerson;
        customer.Email = model.Email;
        customer.PhoneNumber = model.PhoneNumber;
        customer.VatNumber = model.VatNumber;

        await databaseContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(string userId, Guid id)
    {
        var customer = await databaseContext.Customers
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        if (customer == null) return false;

        databaseContext.Customers.Remove(customer);
        await databaseContext.SaveChangesAsync();
        return true;
    }

    private static CustomerResponseModel MapToResponse(Customer c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Street = c.Street,
        HouseNumber = c.HouseNumber,
        PostalCode = c.PostalCode,
        City = c.City,
        Country = c.Country,
        ContactPerson = c.ContactPerson,
        Email = c.Email,
        PhoneNumber = c.PhoneNumber,
        VatNumber = c.VatNumber
    };
}
