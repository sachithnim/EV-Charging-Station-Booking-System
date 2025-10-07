using WebService.Dtos;
using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IEVOwnerService
    {
        Task<List<EVOwnerDto>> GetAllAsync();
        Task<EVOwnerDto> GetByNICAsync(string nic);
        Task<string> CreateAsync(EVOwner owner);
        Task UpdateAsync(string nic, EVOwner owner);
        Task DeleteAsync(string nic);
        Task ActivateAsync(string nic);
        Task DeactivateAsync(string nic);
    }
}