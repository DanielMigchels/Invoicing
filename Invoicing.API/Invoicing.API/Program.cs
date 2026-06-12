using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Services
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

app.Run();