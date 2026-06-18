using Invoicing.API.Data;
using Invoicing.API.Data.Models;
using Invoicing.API.Options;
using Invoicing.API.Services.Authentication;
using Invoicing.API.Services.Companies;
using Invoicing.API.Services.Customers;
using Invoicing.API.Services.InvoiceLines;
using Invoicing.API.Services.InvoicePdfGenerator;
using Invoicing.API.Services.Invoices;
using Invoicing.API.Services.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 4;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
}).AddEntityFrameworkStores<DatabaseContext>().AddDefaultTokenProviders();

var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtOptions:Secret"] ?? throw new Exception("Could not read JWT secret"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddOptions<JwtOptions>().Bind(builder.Configuration.GetSection("JwtOptions")).ValidateDataAnnotations().ValidateOnStart();

builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<ICustomerService, CustomerService>();
builder.Services.AddTransient<ICompanyService, CompanyService>();
builder.Services.AddTransient<IInvoiceService, InvoiceService>();
builder.Services.AddTransient<IInvoiceLineService, InvoiceLineService>();
builder.Services.AddTransient<IInvoicePdfGeneratorService, InvoicePdfGeneratorService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddSpaStaticFiles(options =>
{
    options.RootPath = "wwwroot/Invoicing.UI/browser";
});

var app = builder.Build();

// OpenAPI + Scalar
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/scalar");
}

app.UseSerilogRequestLogging();

app.UseAuthorization();

// Static files
app.UseStaticFiles();
app.UseSpaStaticFiles();

// API endpoints
app.MapControllers();

// SPA (must come last, only for non-API routes)
app.MapWhen(
    ctx => !ctx.Request.Path.StartsWithSegments("/api") &&
           !ctx.Request.Path.StartsWithSegments("/scalar") &&
           !ctx.Request.Path.StartsWithSegments("/openapi"),
    spaApp => spaApp.UseSpa(spa =>
    {
        if (app.Environment.IsDevelopment())
        {
            spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
        }
    }));


using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
await db.Database.MigrateAsync();

app.Run();