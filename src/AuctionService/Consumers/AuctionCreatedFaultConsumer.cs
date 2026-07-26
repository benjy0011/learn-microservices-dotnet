using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        // 1. AuctionService creates an auction and publishes AuctionCreated.
        // 2. SearchService receives it. If Model == "Foo", it throws an exception. MassTransit retries five times, five seconds apart.
        // 3. If all retries fail, MassTransit generates and publishes Fault<AuctionCreated> with the original message plus exception details. The failed delivery is typically moved to RabbitMQ’s error queue—not stored in your application database.
        // 4. AuctionService’s fault consumer receives the fault, changes Model from "Foo" to "FooBar", and republishes the original AuctionCreated event.
        // 5. SearchService receives the corrected event and saves it successfully.
        Console.WriteLine("--> Conuming faulty creation");

        var exception = context.Message.Exceptions.First();

        if (exception.ExceptionType == "System.ArgumentException")
        {
            context.Message.Message.Model = "FooBar";

            await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("Not an argument excption - update error dashboard somewhere (mock)");
        }
    }
}
