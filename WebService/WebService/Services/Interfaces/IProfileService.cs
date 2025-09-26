using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IProfileService
    {
        Task<UserProfile> GetProfileAsync(string identifier, string role);
    }
}
