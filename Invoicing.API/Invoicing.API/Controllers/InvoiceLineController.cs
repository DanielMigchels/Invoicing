using Invoicing.API.Services.InvoiceLines;
using Invoicing.API.Services.InvoiceLines.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.API.Controllers;

[ApiController]
[Route("api/[controller]/{invoiceId:guid}")]
[Authorize]
public class InvoiceLineController(IInvoiceLineService invoiceLineService) : AppControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid invoiceId, [FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        var result = await invoiceLineService.GetAll(UserId, invoiceId, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid invoiceId, Guid id)
    {
        var result = await invoiceLineService.GetById(UserId, invoiceId, id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid invoiceId, [FromBody] CreateInvoiceLineRequestModel model)
    {
        var result = await invoiceLineService.Create(UserId, invoiceId, model);
        if (result == null) return NotFound();
        return Created($"api/invoiceline/{invoiceId}/{result.Id}", result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid invoiceId, Guid id, [FromBody] UpdateInvoiceLineRequestModel model)
    {
        var success = await invoiceLineService.Update(UserId, invoiceId, id, model);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid invoiceId, Guid id)
    {
        var success = await invoiceLineService.Delete(UserId, invoiceId, id);
        return success ? NoContent() : NotFound();
    }
}
