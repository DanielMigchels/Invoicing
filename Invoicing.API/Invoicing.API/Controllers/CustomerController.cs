using Invoicing.API.Services.Customers;
using Invoicing.API.Services.Customers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomerController(ICustomerService customerService) : AppControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        var result = await customerService.GetAll(UserId, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await customerService.GetById(UserId, id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequestModel model)
    {
        var result = await customerService.Create(UserId, model);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequestModel model)
    {
        var success = await customerService.Update(UserId, id, model);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await customerService.Delete(UserId, id);
        return success ? NoContent() : NotFound();
    }
}
