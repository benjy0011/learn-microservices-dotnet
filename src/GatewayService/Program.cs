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

var app = builder.Build();

app.MapReverseProxy();


app.UseAuthentication();
app.UseAuthorization();

app.Run();
