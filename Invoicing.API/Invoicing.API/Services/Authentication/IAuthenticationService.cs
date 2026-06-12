using Invoicing.API.Services.Authentication.Models;

namespace Invoicing.API.Services.Authentication;

public interface IAuthenticationService
{
    public Task<LoginResponseModel> Login(LoginRequestModel loginRequestModel);
    public Task<RegisterResponseModel> Register(RegisterRequestModel registerRequestModel);
}
