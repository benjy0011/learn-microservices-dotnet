using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
  opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});


// It will look into any class with Profile
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
{
  // Store outgoing messages in PostgreSQL first, making message publishing reliable
  // even when RabbitMQ is temporarily unavailable (the Outbox pattern).
  x.AddEntityFrameworkOutbox<AuctionDbContext>( o =>
  {
    // Check for unsent outbox messages every 10 seconds.
    o.QueryDelay = TimeSpan.FromSeconds(10);

    // PostgreSQL is the Entity Framework database used by this service.
    o.UsePostgres();
    // Send published messages through the database outbox before RabbitMQ.
    o.UseBusOutbox();
  });


  // Discover and register AuctionCreatedFaultConsumer so MassTransit creates its receive endpoint.
  x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
  // Prefix automatically generated endpoint/queue names with "auction".
  // "auction" + "AuctionCreatedFaultConsumer" → auction-auction-created-fault
  x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));


  // Use RabbitMQ to deliver messages between microservices.
  x.UsingRabbitMq((context, cfg) =>
  {
    // Automatically configure RabbitMQ queues/endpoints for registered consumers.
    cfg.ConfigureEndpoints(context);
  });
});

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

// Need to come before authorization, cuz we need to know who they are before giving permission
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{
  DbInitializer.InitDb(app);
}
catch (Exception e)
{
  Console.WriteLine(e);
}

app.Run();
