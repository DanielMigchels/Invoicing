using Invoicing.API.Data.Models;

namespace Invoicing.API.Services.InvoicePdfGenerator
{
    public interface IInvoicePdfGeneratorService
    {
        Stream GeneratePdf(Invoice invoice);
    }
}
