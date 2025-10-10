using WebService.Exceptions;
using WebService.Models;
using WebService.Services.Interfaces;
using WebService.Repositories.Interfaces;
using WebService.Dtos;

namespace WebService.Services
{
    public class BookingService : IBookingService
    {
        private readonly IMongoRepository<Booking> _repo;
        private readonly IMongoRepository<ChargingStation> _stations;

        public BookingService(IMongoRepository<Booking> repo, IMongoRepository<ChargingStation> stations)
        {
            _repo = repo;
            _stations = stations;
        }

        public async Task<List<Booking>> GetAllAsync() => await _repo.GetAllAsync();

        public async Task<Booking> GetByIdAsync(string id)
        {
            var booking = await _repo.GetByIdAsync(id);
            if (booking == null) throw new BusinessException("Booking not found.");
            return booking;
        }

        public async Task<List<Booking>> GetByNicAsync(string nic) =>
            await _repo.FindAsync(b => b.Nic == nic);


        public async Task<string> CreateAsync(Booking booking)
        {
            // Rule: reservation date must be within 7 days
            if ((booking.StartTime - DateTime.UtcNow).TotalDays > 7)
                throw new BusinessException("Reservation date must be within 7 days.");

            // Rule: prevent overlapping slot bookings
            var conflicts = await _repo.FindAsync(b =>
                b.StationId == booking.StationId &&
                b.Name == booking.Name &&
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
            return booking.Id ?? throw new InvalidOperationException("Booking ID was not generated");
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

        public async Task CancelAsync(string id)
        {
            var booking = await _repo.GetByIdAsync(id);
            if (booking == null) throw new BusinessException("Booking not found.");

            if ((booking.StartTime - DateTime.UtcNow).TotalHours < 12)
                throw new BusinessException("Cannot cancel booking within 12 hours of start time.");

            booking.Status = "Cancelled";
            booking.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(id, booking);
        }

        public async Task ApproveAsync(string id)
        {
            var booking = await _repo.GetByIdAsync(id);
            if (booking == null) throw new BusinessException("Booking not found.");

            booking.Status = "Approved";
            booking.QrToken = Guid.NewGuid().ToString(); // dummy QR token
            booking.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(id, booking);
        }

        public async Task CompleteAsync(string id)
        {
            var booking = await _repo.GetByIdAsync(id);
            if (booking == null) throw new BusinessException("Booking not found.");

            booking.Status = "Completed";
            booking.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(id, booking);
        }

        public async Task<BookingDetailsDto> GetBookingWithStationAsync(string bookingId)
        {
            var booking = await _repo.GetByIdAsync(bookingId);
            if (booking == null)
                throw new BusinessException("Booking not found.");

            var station = await _stations.GetByIdAsync(booking.StationId);
            if (station == null)
                throw new BusinessException("Associated station not found.");

            var slot = station.Slots.FirstOrDefault(s => s.Id == booking.SlotId);
            if (slot == null)
                throw new BusinessException("Associated slot not found in station.");

            return new BookingDetailsDto
            {
                Id = booking.Id!,
                Nic = booking.Nic,
                Name = booking.Name,
                Status = booking.Status,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                QrToken = booking.QrToken,
                StationId = station.Id,
                StationName = station.Name,
                StationAddress = station.Address,
                StationType = station.Type,
                SlotId = slot.Id,
                SlotCode = slot.Code,
                ConnectorType = slot.ConnectorType,
                PowerKw = (double)slot.PowerKw
            };
        }

        public async Task<List<BookingDetailsDto>> GetAllWithStationAsync()
        {
            var bookings = await _repo.GetAllAsync();
            var stations = await _stations.GetAllAsync();

            var results = new List<BookingDetailsDto>();

            foreach (var b in bookings)
            {
                var station = stations.FirstOrDefault(s => s.Id == b.StationId);
                var slot = station?.Slots.FirstOrDefault(s => s.Id == b.SlotId);

                if (station != null && slot != null)
                {
                    results.Add(new BookingDetailsDto
                    {
                        Id = b.Id!,
                        Nic = b.Nic,
                        Name = b.Name,
                        Status = b.Status,
                        StartTime = b.StartTime,
                        EndTime = b.EndTime,
                        QrToken = b.QrToken,
                        StationId = station.Id,
                        StationName = station.Name,
                        StationAddress = station.Address,
                        StationType = station.Type,
                        SlotId = slot.Id,
                        SlotCode = slot.Code,
                        ConnectorType = slot.ConnectorType,
                        PowerKw = (double)slot.PowerKw
                    });
                }
            }

            return results;
        }

    }
}