using Invoicing.API.Services.InvoiceLines;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoiceLineController(IInvoiceLineService invoiceLineService) : AppControllerBase
{
}
