using WebService.Exceptions;
using WebService.Models;
using WebService.Services.Interfaces;
using WebService.Repositories.Interfaces;

namespace WebService.Services
{
    public class BookingService : IBookingService
    {
        private readonly IMongoRepository<Booking> _repo;

        public BookingService(IMongoRepository<Booking> repo)
        {
            _repo = repo;
        }

        public async Task<List<Booking>> GetAllAsync() => await _repo.GetAllAsync();

        public async Task<Booking> GetByIdAsync(string id)
        {
            var booking = await _repo.GetByIdAsync(id);
            if (booking == null) throw new BusinessException("Booking not found.");
            return booking;
        }

        public async Task<string> CreateAsync(Booking booking)
        {
            // Rule: reservation date must be within 7 days
            if ((booking.StartTime - DateTime.UtcNow).TotalDays > 7)
                throw new BusinessException("Reservation date must be within 7 days.");

            // Rule: prevent overlapping slot bookings
            var conflicts = await _repo.FindAsync(b =>
                b.StationId == booking.StationId &&
                b.SlotId == booking.SlotId &&
                b.Status != "Cancelled" &&
                (
                    (booking.StartTime >= b.StartTime && booking.StartTime < b.EndTime) ||
                    (booking.EndTime > b.StartTime && booking.EndTime <= b.EndTime)
                )
            );
            if (conflicts.Count > 0)
                throw new BusinessException("Slot is already booked for this time range.");

            booking.Status = "Pending";
            booking.CreatedAt = DateTime.UtcNow;
            booking.UpdatedAt = DateTime.UtcNow;

            await _repo.CreateAsync(booking);
            return booking.Id;
        }

        public async Task UpdateAsync(string id, Booking updated)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) throw new BusinessException("Booking not found.");

            // Rule: cannot update < 12 hours before start
            if ((existing.StartTime - DateTime.UtcNow).TotalHours < 12)
                throw new BusinessException("Cannot update booking within 12 hours of start time.");

            updated.Id = id;
            updated.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(id, updated);
        }
    }
}
