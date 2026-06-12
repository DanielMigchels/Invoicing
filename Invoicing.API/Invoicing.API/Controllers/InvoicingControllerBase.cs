using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Invoicing.API.Controllers;

public class InvoicingControllerBase : ControllerBase
{
    protected string UserId => HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
}
