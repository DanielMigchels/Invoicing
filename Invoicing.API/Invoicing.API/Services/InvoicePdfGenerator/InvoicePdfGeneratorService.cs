using Invoicing.API.Services.Invoices.Models;
using PdfSharp.Fonts;
using PdfSharp.Pdf;

namespace Invoicing.API.Services.InvoicePdfGenerator;

public class InvoicePdfGeneratorService : IInvoicePdfGeneratorService
{
    public Stream GeneratePdf(InvoiceResponseModel invoice)
    {
        var document = new PdfDocument();

        GlobalFontSettings.FontResolver = new CustomFontResolver();

        var stream = new MemoryStream();
        document.Save(stream);
        stream.Position = 0;
        return stream;
    }
}
