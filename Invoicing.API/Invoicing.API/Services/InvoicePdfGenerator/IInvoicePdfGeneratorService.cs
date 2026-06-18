using Invoicing.API.Services.Invoices.Models;

namespace Invoicing.API.Services.InvoicePdfGenerator
{
    public interface IInvoicePdfGeneratorService
    {
        Stream GeneratePdf(InvoiceResponseModel invoice);
    }
}
