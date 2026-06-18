using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Invoicing.API.Controllers;

public class AppControllerBase : ControllerBase
{
    protected string UserId => HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
}
