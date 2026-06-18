using Invoicing.API.Services.Companies.Models;
using Invoicing.API.Services.Pagination;

namespace Invoicing.API.Services.Companies;

public interface ICompanyService
{
    Task<PaginatedList<CompanyResponseModel>> GetAll(string userId, int page, int pageSize);
    Task<CompanyResponseModel?> GetById(string userId, Guid id);
    Task<CompanyResponseModel> Create(string userId, CreateCompanyRequestModel model);
    Task<bool> Update(string userId, Guid id, UpdateCompanyRequestModel model);
    Task<bool> Delete(string userId, Guid id);
}
