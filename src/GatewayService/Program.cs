using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddReverseProxy()
  .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));


// Trust and validate JWT access tokens issued by the IdentityService.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    // The issuer that created the token; its discovery document provides signing keys.
    options.Authority = builder.Configuration["IdentityServiceUrl"];
    // IdentityService uses HTTP locally. Require HTTPS when deploying outside development.
    options.RequireHttpsMetadata = false;
    // Development shortcut: accept valid tokens from this issuer without checking their audience.
    options.TokenValidationParameters.ValidateAudience = false;
    // Make User.Identity.Name return the custom username claim added by CustomProfileService.
    options.TokenValidationParameters.NameClaimType = "username";
  });


var clientApp = builder.Configuration["ClientApp"]
    ?? throw new InvalidOperationException(
        "The ClientApp configuration setting is required.");

builder.Services.AddCors(options =>
{
    options.AddPolicy("customPolicy", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(clientApp);
    });
});

var app = builder.Build();

app.UseCors();

app.MapReverseProxy();


app.UseAuthentication();
app.UseAuthorization();

app.Run();
