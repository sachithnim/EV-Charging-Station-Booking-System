using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User> GetByIdAsync(string id);
        Task UpdateAsync(string id, User user);
        Task DeleteAsync(string id);
        Task ChangePasswordAsync(string id, string oldPassword, string newPassword);
    }
}