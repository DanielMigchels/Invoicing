using Invoicing.API.Data;
using Invoicing.API.Data.Models;
using Invoicing.API.Services.Companies.Models;
using Invoicing.API.Services.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.API.Services.Companies;

public class CompanyService(DatabaseContext databaseContext) : ICompanyService
{
    public async Task<PaginatedList<CompanyResponseModel>> GetAll(string userId, int page, int pageSize)
    {
        var query = databaseContext.Companies.Where(c => c.UserId == userId);
        var total = await query.CountAsync();

        var data = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => MapToResponse(c))
            .ToListAsync();

        return new PaginatedList<CompanyResponseModel>
        {
            Page = page,
            PageSize = pageSize,
            HasPrevious = page > 1,
            HasNext = page * pageSize < total,
            Data = data
        };
    }

    public async Task<CompanyResponseModel?> GetById(string userId, Guid id)
    {
        var company = await databaseContext.Companies
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        return company == null ? null : MapToResponse(company);
    }

    public async Task<CompanyResponseModel> Create(string userId, CreateCompanyRequestModel model)
    {
        var company = new Company
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = model.Name,
            Street = model.Street,
            HouseNumber = model.HouseNumber,
            PostalCode = model.PostalCode,
            City = model.City,
            Country = model.Country,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            BankAccountNumber = model.BankAccountNumber,
            ChamberOfCommerceNumber = model.ChamberOfCommerceNumber,
            VatNumber = model.VatNumber
        };

        databaseContext.Companies.Add(company);
        await databaseContext.SaveChangesAsync();
        return MapToResponse(company);
    }

    public async Task<bool> Update(string userId, Guid id, UpdateCompanyRequestModel model)
    {
        var company = await databaseContext.Companies
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        if (company == null) return false;

        company.Name = model.Name;
        company.Street = model.Street;
        company.HouseNumber = model.HouseNumber;
        company.PostalCode = model.PostalCode;
        company.City = model.City;
        company.Country = model.Country;
        company.Email = model.Email;
        company.PhoneNumber = model.PhoneNumber;
        company.BankAccountNumber = model.BankAccountNumber;
        company.ChamberOfCommerceNumber = model.ChamberOfCommerceNumber;
        company.VatNumber = model.VatNumber;

        await databaseContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(string userId, Guid id)
    {
        var company = await databaseContext.Companies
            .Where(c => c.UserId == userId && c.Id == id)
            .FirstOrDefaultAsync();

        if (company == null) return false;

        databaseContext.Companies.Remove(company);
        await databaseContext.SaveChangesAsync();
        return true;
    }

    private static CompanyResponseModel MapToResponse(Company c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Street = c.Street,
        HouseNumber = c.HouseNumber,
        PostalCode = c.PostalCode,
        City = c.City,
        Country = c.Country,
        Email = c.Email,
        PhoneNumber = c.PhoneNumber,
        BankAccountNumber = c.BankAccountNumber,
        ChamberOfCommerceNumber = c.ChamberOfCommerceNumber,
        VatNumber = c.VatNumber
    };
}
