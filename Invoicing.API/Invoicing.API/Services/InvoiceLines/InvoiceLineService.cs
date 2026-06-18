using Invoicing.API.Data;
using Invoicing.API.Data.Models;
using Invoicing.API.Services.InvoiceLines.Models;
using Invoicing.API.Services.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.API.Services.InvoiceLines;

public class InvoiceLineService(DatabaseContext databaseContext) : IInvoiceLineService
{
    public async Task<PaginatedList<InvoiceLineResponseModel>> GetAll(string userId, Guid invoiceId, int page, int pageSize)
    {
        var invoiceExists = await databaseContext.Invoices
            .AnyAsync(i => i.UserId == userId && i.Id == invoiceId);

        if (!invoiceExists)
        {
            return new PaginatedList<InvoiceLineResponseModel> { Page = page, PageSize = pageSize };
        }

        var query = databaseContext.InvoiceLines.Where(l => l.InvoiceId == invoiceId);
        var total = await query.CountAsync();

        var data = await query
            .OrderBy(l => l.Description)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => MapToResponse(l))
            .ToListAsync();

        return new PaginatedList<InvoiceLineResponseModel>
        {
            Page = page,
            PageSize = pageSize,
            HasPrevious = page > 1,
            HasNext = page * pageSize < total,
            Data = data
        };
    }

    public async Task<InvoiceLineResponseModel?> GetById(string userId, Guid invoiceId, Guid id)
    {
        var line = await databaseContext.InvoiceLines
            .Where(l => l.InvoiceId == invoiceId && l.Id == id)
            .Where(l => l.Invoice.UserId == userId)
            .FirstOrDefaultAsync();

        return line == null ? null : MapToResponse(line);
    }

    public async Task<InvoiceLineResponseModel?> Create(string userId, Guid invoiceId, CreateInvoiceLineRequestModel model)
    {
        var invoiceExists = await databaseContext.Invoices
            .AnyAsync(i => i.UserId == userId && i.Id == invoiceId);

        if (!invoiceExists) return null;

        var line = new InvoiceLine
        {
            Id = Guid.NewGuid(),
            InvoiceId = invoiceId,
            Description = model.Description,
            Quantity = model.Quantity,
            Unit = model.Unit,
            UnitPrice = model.UnitPrice,
            DiscountAmount = model.DiscountAmount,
            VatPercentage = model.VatPercentage,
            Total = model.Total
        };

        databaseContext.InvoiceLines.Add(line);
        await databaseContext.SaveChangesAsync();
        return MapToResponse(line);
    }

    public async Task<bool> Update(string userId, Guid invoiceId, Guid id, UpdateInvoiceLineRequestModel model)
    {
        var line = await databaseContext.InvoiceLines
            .Where(l => l.InvoiceId == invoiceId && l.Id == id)
            .Where(l => l.Invoice.UserId == userId)
            .FirstOrDefaultAsync();

        if (line == null) return false;

        line.Description = model.Description;
        line.Quantity = model.Quantity;
        line.Unit = model.Unit;
        line.UnitPrice = model.UnitPrice;
        line.DiscountAmount = model.DiscountAmount;
        line.VatPercentage = model.VatPercentage;
        line.Total = model.Total;

        await databaseContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(string userId, Guid invoiceId, Guid id)
    {
        var line = await databaseContext.InvoiceLines
            .Where(l => l.InvoiceId == invoiceId && l.Id == id)
            .Where(l => l.Invoice.UserId == userId)
            .FirstOrDefaultAsync();

        if (line == null) return false;

        databaseContext.InvoiceLines.Remove(line);
        await databaseContext.SaveChangesAsync();
        return true;
    }

    private static InvoiceLineResponseModel MapToResponse(InvoiceLine l) => new()
    {
        Id = l.Id,
        InvoiceId = l.InvoiceId,
        Description = l.Description,
        Quantity = l.Quantity,
        Unit = l.Unit,
        UnitPrice = l.UnitPrice,
        DiscountAmount = l.DiscountAmount,
        VatPercentage = l.VatPercentage,
        Total = l.Total
    };
}
