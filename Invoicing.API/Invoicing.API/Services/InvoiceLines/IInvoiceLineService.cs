using Invoicing.API.Services.InvoiceLines.Models;
using Invoicing.API.Services.Pagination;

namespace Invoicing.API.Services.InvoiceLines;

public interface IInvoiceLineService
{
    Task<PaginatedList<InvoiceLineResponseModel>> GetAll(string userId, Guid invoiceId, int page, int pageSize);
    Task<InvoiceLineResponseModel?> GetById(string userId, Guid invoiceId, Guid id);
    Task<InvoiceLineResponseModel?> Create(string userId, Guid invoiceId, CreateInvoiceLineRequestModel model);
    Task<bool> Update(string userId, Guid invoiceId, Guid id, UpdateInvoiceLineRequestModel model);
    Task<bool> Delete(string userId, Guid invoiceId, Guid id);
}
