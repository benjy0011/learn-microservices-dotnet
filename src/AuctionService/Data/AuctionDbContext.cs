using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext(DbContextOptions<AuctionDbContext> options) : DbContext(options)
{

    // Old way 

    // public AuctionDbContext(DbContextOptions options): base(options)
    // {
        
    // }


    // Entity Framework will setup the Auctions table, together with Items as it is specified inside Auction
    public DbSet<Auction> Auctions { get; set; }


    // Override DbContext's protected model-building method; Entity Framework calls it automatically.
    // 'protected' limits access to this class and subclasses, while 'override' customizes the
    // method inherited from DbContext.
    // Configure Entity Framework and MassTransit tables for this database.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Records received messages so consumers can avoid processing duplicates.
        modelBuilder.AddInboxStateEntity();
        // Stores outgoing messages in the database until MassTransit delivers them.
        modelBuilder.AddOutboxMessageEntity();
        // Tracks the outbox delivery process and cleanup state.
        modelBuilder.AddOutboxStateEntity();
    }
}
