using System.Security.Claims;
using Duende.IdentityModel;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Services;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task GetProfileDataAsync(ProfileDataRequestContext context, CancellationToken ct)
    {
        // `context.Subject` identifies the user who has just signed in; load their Identity record.
        var user = await _userManager.GetUserAsync(context.Subject);

        // Load claims stored for this user (registration stores the full name as a `name` claim).
        var existingClaims = await _userManager.GetClaimsAsync(user);

        // Add the login username as a custom claim in the token being issued.
        var claims = new List<Claim>
        {
            new Claim("username", user.UserName)
        };

        // Copy the custom username claim into the ID/access token.
        context.IssuedClaims.AddRange(claims);

        // Also include the user's saved full name (`name`) claim in the token.
        context.IssuedClaims.Add(existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name));
    }

    public Task IsActiveAsync(IsActiveContext context, CancellationToken ct)
    {
        return Task.CompletedTask;
    }
}
