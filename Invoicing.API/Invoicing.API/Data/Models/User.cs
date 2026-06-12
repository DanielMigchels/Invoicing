using Microsoft.AspNetCore.Identity;

namespace Invoicing.API.Data.Models;

public class User : IdentityUser
{
    public bool HasAccess { get; set; } = false;
}