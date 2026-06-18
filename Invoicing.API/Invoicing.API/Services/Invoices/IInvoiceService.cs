using Invoicing.API.Services.Invoices.Models;
using Invoicing.API.Services.Pagination;

namespace Invoicing.API.Services.Invoices;

public interface IInvoiceService
{
    Task<PaginatedList<InvoiceResponseModel>> GetAll(string userId, int page, int pageSize);
    Task<InvoiceResponseModel?> GetById(string userId, Guid id);
    Task<InvoiceResponseModel> Create(string userId, CreateInvoiceRequestModel model);
    Task<bool> Update(string userId, Guid id, UpdateInvoiceRequestModel model);
    Task<bool> Delete(string userId, Guid id);
    Task<Stream?> DownloadPdf(string userId, Guid id);
}
