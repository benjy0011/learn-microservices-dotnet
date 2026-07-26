using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer(IMapper mapper) : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper = mapper;

    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("--> Consume auction updated: " + context.Message.Id);

        var updatedItem = _mapper.Map<Item>(context.Message);
        
        var result = await DB.Update<Item>()
            .MatchID(context.Message.Id)
            .ModifyOnly(b =>
                new { 
                    b.Make,
                    b.Model,
                    b.Year,
                    b.Color,
                    b.Mileage
                },
                updatedItem
            )
            .ExecuteAsync();

        if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionUpdated), "Problem updating mongodb");
    }
}
