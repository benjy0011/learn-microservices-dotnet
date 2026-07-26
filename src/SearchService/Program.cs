using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddHttpClient<AuctionSvcHttpClient>().AddPolicyHandler(GetPolicy());

builder.Services.AddMassTransit(x =>
{
  // Auto search for namespace, dont need to add for new consumer class files
  x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

  // MassTransit will automatically create and listen to a RabbitMQ queue named: search-auction-created
  x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

  x.UsingRabbitMq((context, cfg) =>
  {
    // Explicitly create and configure the RabbitMQ queue used by this consumer.
    cfg.ReceiveEndpoint("search-auction-created", e =>
    {
      // For each AuctionCreated message received by search-auction-created:
      // 1. AuctionCreatedConsumer runs.
      // 2. If it throws—for example, item.SaveAsync() fails because MongoDB is down—MassTransit waits 5 seconds.
      // 3. It retries the same consumer/message up to 5 times.
      //    So there can be 6 total attempts
      e.UseMessageRetry(r => r.Interval(5, 5)); // 5 times retry, 5 seconds interval

      // Connect AuctionCreatedConsumer so it receives AuctionCreated messages from this queue.
      e.ConfigureConsumer<AuctionCreatedConsumer>(context);
    });

    cfg.ReceiveEndpoint("search-auction-updated", e =>
    {
      e.UseMessageRetry(r => r.Interval(5, 5));

      e.ConfigureConsumer<AuctionUpdatedConsumer>(context);
    });

    cfg.ReceiveEndpoint("search-auction-deleted", e =>
    {
      e.UseMessageRetry(r => r.Interval(5, 5));

      e.ConfigureConsumer<AuctionDeletedConsumer>(context);
    });

    // Automatically configure endpoints for any other registered consumers.
    cfg.ConfigureEndpoints(context);
  });
});


var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(async () =>
{
  try
  {
    await DbInitializer.InitDb(app);
  }
  catch (Exception e)
  {
    Console.WriteLine(e);
  }
});


app.Run();


static IAsyncPolicy<HttpResponseMessage> GetPolicy()
  => HttpPolicyExtensions
      .HandleTransientHttpError()
      .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
      .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));