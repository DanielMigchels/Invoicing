using Invoicing.API.Services.Companies;
using Invoicing.API.Services.Companies.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyController(ICompanyService companyService) : AppControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        var result = await companyService.GetAll(UserId, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await companyService.GetById(UserId, id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompanyRequestModel model)
    {
        var result = await companyService.Create(UserId, model);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCompanyRequestModel model)
    {
        var success = await companyService.Update(UserId, id, model);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await companyService.Delete(UserId, id);
        return success ? NoContent() : NotFound();
    }
}
