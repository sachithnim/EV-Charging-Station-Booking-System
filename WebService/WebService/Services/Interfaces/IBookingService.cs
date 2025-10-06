using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetAllAsync();
        Task<Booking> GetByIdAsync(string id);
        Task<string> CreateAsync(Booking booking);
        Task UpdateAsync(string id, Booking booking);
        Task<List<Booking>> GetByNicAsync(string nic);
    }
}
