using Invoicing.API.Services.Customers.Models;
using Invoicing.API.Services.Pagination;

namespace Invoicing.API.Services.Customers;

public interface ICustomerService
{
    Task<PaginatedList<CustomerResponseModel>> GetAll(string userId, int page, int pageSize);
    Task<CustomerResponseModel?> GetById(string userId, Guid id);
    Task<CustomerResponseModel> Create(string userId, CreateCustomerRequestModel model);
    Task<bool> Update(string userId, Guid id, UpdateCustomerRequestModel model);
    Task<bool> Delete(string userId, Guid id);
}
