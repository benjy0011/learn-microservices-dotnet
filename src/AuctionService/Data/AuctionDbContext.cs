using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext(DbContextOptions<AuctionDbContext> options) : DbContext(options)
{
    // Entity Framework will setup the Auctions table, together with Items as it is specified inside Auction
    public DbSet<Auction> Auctions { get; set; }
}
