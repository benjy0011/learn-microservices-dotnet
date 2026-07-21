using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    // MongoDb lib is a static class, no dependancy injection needed
    

    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems(
        [FromQuery]string searchTerm, 
        [FromQuery]int pageNumber = 1,
        [FromQuery]int pageSize = 4
    )
    {
        var query = DB.PagedSearch<Item>();

        query.Sort(x => x.Ascending(a => a.Make));

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query.Match(Search.Full, searchTerm).SortByTextScore();
        }

        query.PageNumber(pageNumber);
        query.PageSize(pageSize);

        var result = await query.ExecuteAsync();

        return Ok(new
        {
            result = result.Results,
            pageCount = result.PageCount,
            totalCount = result.TotalCount
        });
    }
}
