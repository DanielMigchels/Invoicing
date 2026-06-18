using Invoicing.API.Services.Invoices;
using Invoicing.API.Services.Invoices.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoiceController(IInvoiceService invoiceService) : AppControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        var result = await invoiceService.GetAll(UserId, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await invoiceService.GetById(UserId, id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpGet("{id:guid}/pdf")]
    public async Task<IActionResult> DownloadPdf([FromRoute] Guid id)
    {
        var result = await invoiceService.DownloadPdf(UserId, id);
        return result != null ? File(result, "application/pdf", "ReleaseNotes.pdf") : BadRequest();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceRequestModel model)
    {
        var result = await invoiceService.Create(UserId, model);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvoiceRequestModel model)
    {
        var success = await invoiceService.Update(UserId, id, model);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await invoiceService.Delete(UserId, id);
        return success ? NoContent() : NotFound();
    }
}
