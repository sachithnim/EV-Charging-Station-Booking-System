using WebService.Dtos;
using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IEVOwnerService
    {
        Task<List<EVOwnerDto>> GetAllAsync();
        Task<EVOwnerDto> GetByNICAsync(string nic);
        Task<string> CreateAsync(EVOwner owner);
        Task UpdateAsync(string nic, UpdateEvOwnerDto owner);
        Task ChangePasswordAsync(string nic, string oldPassword, string newPassword);
        Task DeleteAsync(string nic);
        Task ActivateAsync(string nic);
        Task DeactivateAsync(string nic);
    }
}