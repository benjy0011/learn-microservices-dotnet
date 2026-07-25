using AuctionService.Data;
using MassTransit;
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

  // Use RabbitMQ to deliver messages between microservices.
  x.UsingRabbitMq((context, cfg) =>
  {
    // Automatically configure RabbitMQ queues/endpoints for registered consumers.
    cfg.ConfigureEndpoints(context);
  });
});


var app = builder.Build();

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
