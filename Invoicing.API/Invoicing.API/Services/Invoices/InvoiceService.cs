using Invoicing.API.Data;
using Invoicing.API.Data.Models;
using Invoicing.API.Services.InvoicePdfGenerator;
using Invoicing.API.Services.Invoices.Models;
using Invoicing.API.Services.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.API.Services.Invoices;

public class InvoiceService(DatabaseContext databaseContext, IInvoicePdfGeneratorService invoicePdfGeneratorService) : IInvoiceService
{
    public async Task<PaginatedList<InvoiceResponseModel>> GetAll(string userId, int page, int pageSize)
    {
        var query = databaseContext.Invoices
            .Include(i => i.Company)
            .Include(i => i.Customer)
            .Include(i => i.InvoiceLines)
            .Where(i => i.UserId == userId);

        var total = await query.CountAsync();

        var data = await query
            .OrderByDescending(i => i.InvoiceDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => MapToResponse(i))
            .ToListAsync();

        return new PaginatedList<InvoiceResponseModel>
        {
            Page = page,
            PageSize = pageSize,
            HasPrevious = page > 1,
            HasNext = page * pageSize < total,
            Data = data
        };
    }

    public async Task<InvoiceResponseModel?> GetById(string userId, Guid id)
    {
        var invoice = await databaseContext.Invoices
            .Include(i => i.Company)
            .Include(i => i.Customer)
            .Include(i => i.InvoiceLines)
            .Where(i => i.UserId == userId && i.Id == id)
            .FirstOrDefaultAsync();

        return invoice == null ? null : MapToResponse(invoice);
    }

    public async Task<InvoiceResponseModel> Create(string userId, CreateInvoiceRequestModel model)
    {
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            InvoiceNumber = model.InvoiceNumber,
            InvoiceDate = model.InvoiceDate,
            DueDate = model.DueDate,
            CompanyId = model.CompanyId,
            CustomerId = model.CustomerId,
            Currency = model.Currency,
            VatExemptionReason = model.VatExemptionReason,
            PaymentReference = model.PaymentReference,
            Notes = model.Notes
        };

        databaseContext.Invoices.Add(invoice);
        await databaseContext.SaveChangesAsync();

        await databaseContext.Entry(invoice).Reference(i => i.Company).LoadAsync();
        await databaseContext.Entry(invoice).Reference(i => i.Customer).LoadAsync();

        return MapToResponse(invoice);
    }

    public async Task<bool> Update(string userId, Guid id, UpdateInvoiceRequestModel model)
    {
        var invoice = await databaseContext.Invoices
            .Where(i => i.UserId == userId && i.Id == id)
            .FirstOrDefaultAsync();

        if (invoice == null) return false;

        invoice.InvoiceNumber = model.InvoiceNumber;
        invoice.InvoiceDate = model.InvoiceDate;
        invoice.DueDate = model.DueDate;
        invoice.CompanyId = model.CompanyId;
        invoice.CustomerId = model.CustomerId;
        invoice.Currency = model.Currency;
        invoice.VatExemptionReason = model.VatExemptionReason;
        invoice.PaymentReference = model.PaymentReference;
        invoice.Notes = model.Notes;

        await databaseContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(string userId, Guid id)
    {
        var invoice = await databaseContext.Invoices
            .Where(i => i.UserId == userId && i.Id == id)
            .FirstOrDefaultAsync();

        if (invoice == null) return false;

        databaseContext.Invoices.Remove(invoice);
        await databaseContext.SaveChangesAsync();
        return true;
    }

    private static InvoiceResponseModel MapToResponse(Invoice i) => new()
    {
        Id = i.Id,
        InvoiceNumber = i.InvoiceNumber,
        InvoiceDate = i.InvoiceDate,
        DueDate = i.DueDate,
        CompanyId = i.CompanyId,
        CompanyName = i.Company?.Name ?? string.Empty,
        CustomerId = i.CustomerId,
        CustomerName = i.Customer?.Name ?? string.Empty,
        Currency = i.Currency,
        TotalExcludingVat = i.InvoiceLines.Sum(l => l.Quantity * l.UnitPrice - l.DiscountAmount),
        VatAmount = i.InvoiceLines.Sum(l => (l.Quantity * l.UnitPrice - l.DiscountAmount) * l.VatPercentage / 100),
        TotalIncludingVat = i.InvoiceLines.Sum(l => l.Total),
        VatExemptionReason = i.VatExemptionReason,
        PaymentReference = i.PaymentReference,
        Notes = i.Notes
    };

    public async Task<Stream?> DownloadPdf(string userId, Guid id)
    {
        var invoice = await GetById(userId, id);

        if (invoice == null)
        {
            return null;
        }

        var pdf = invoicePdfGeneratorService.GeneratePdf(invoice);
        return pdf;
    }
}
