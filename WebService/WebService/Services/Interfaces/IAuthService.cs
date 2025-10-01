using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterUserAsync(User user);
        Task<string> loginAsync(string username,  string password);
        Task<string> EVOwnerLoginAsync(string nic, string password);

    }
}
