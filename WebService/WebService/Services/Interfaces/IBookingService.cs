using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetAllAsync();
        Task<Booking> GetByIdAsync(string id);
        Task<string> CreateAsync(Booking booking);
        Task UpdateAsync(string id, Booking booking);

        Task CancelAsync(string id);
        Task ApproveAsync(string id);
        Task CompleteAsync(string id);
        Task<List<Booking>> GetByNicAsync(string nic);
    }
}
