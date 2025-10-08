using WebService.Dtos;
using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;

namespace WebService.Services
{
    public class ChargingStationService : IChargingStationService
    {
        private readonly IMongoRepository<ChargingStation> _stations;
        private readonly IMongoRepository<Booking> _bookings;

        public ChargingStationService(
            IMongoRepository<ChargingStation> stations,
            IMongoRepository<Booking> bookings)
        {
            _stations = stations;
            _bookings = bookings;
        }

        // Stations
        public async Task<List<ChargingStation>> GetAllAsync(string? type = null, bool? isActive = null)
        {
            if (type == null && isActive == null) return await _stations.GetAllAsync();

            return await _stations.FindAsync(s =>
                (type == null || s.Type == type) &&
                (isActive == null || s.IsActive == isActive));
        }

        public async Task<ChargingStation?> GetByIdAsync(string id) => await _stations.GetByIdAsync(id);

        public async Task<string> CreateAsync(CreateStationDto dto, string? userId = null)
        {
            ValidateSchedule(dto.Schedules);

            var station = new ChargingStation
            {
                Name = dto.Name.Trim(),
                Address = dto.Address.Trim(),
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Type = dto.Type.ToUpper() == "DC" ? "DC" : "AC",
                Schedules = dto.Schedules.Select(MapWindow).ToList(),
                Slots = dto.Slots.Select(MapCreateSlot).ToList(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            await _stations.CreateAsync(station);
            return station.Id;
        }

        public async Task UpdateDetailsAsync(string id, UpdateStationDto dto, string? userId = null)
        {
            var station = await _stations.GetByIdAsync(id)
                          ?? throw new BusinessException("Charging station not found.");

            station.Name = dto.Name.Trim();
            station.Address = dto.Address.Trim();
            station.Latitude = dto.Latitude;
            station.Longitude = dto.Longitude;
            station.Type = dto.Type.ToUpper() == "DC" ? "DC" : "AC";
            station.IsActive = dto.IsActive;
            station.UpdatedAt = DateTime.UtcNow;
            station.UpdatedBy = userId;

            if (dto.Schedules is not null)
            {
                ValidateSchedule(dto.Schedules);
                station.Schedules = dto.Schedules.Select(MapWindow).ToList();
            }

            await _stations.UpdateAsync(id, station);
        }

        public async Task UpdateScheduleAsync(string id, List<ScheduleWindowDto> schedule, string? userId = null)
        {
            ValidateSchedule(schedule);

            var station = await _stations.GetByIdAsync(id)
                          ?? throw new BusinessException("Charging station not found.");

            station.Schedules = schedule.Select(MapWindow).ToList();
            station.UpdatedAt = DateTime.UtcNow;
            station.UpdatedBy = userId;

            await _stations.UpdateAsync(id, station);
        }

        public async Task ActivateStationAsync(string id)
        {
            var station = await _stations.GetByIdAsync(id)
                          ?? throw new BusinessException("Charging station not found.");

            // Reactivate only if currently inactive
            if (station.IsActive)
                throw new BusinessException("Station is already active.");

            station.IsActive = true;
            station.UpdatedAt = DateTime.UtcNow;

            await _stations.UpdateAsync(id, station);
        }

        public async Task DeactivateStationAsync(string id)
        {
            var station = await _stations.GetByIdAsync(id)
                          ?? throw new BusinessException("Charging station not found.");

            var now = DateTime.UtcNow;
            var hasActive = await _bookings.FindAsync(b =>
                b.StationId == id &&
                (b.Status == "Pending" || b.Status == "Approved" || b.Status == "InProgress") &&
                b.EndTime >= now);

            if (hasActive.Count() > 0)
                throw new BusinessException("Cannot deactivate: station has active or upcoming bookings.");

            station.IsActive = false;
            station.UpdatedAt = DateTime.UtcNow;
            await _stations.UpdateAsync(id, station);
        }

        public async Task DeleteStationAsync(string id)
        {
            var station = await _stations.GetByIdAsync(id)
                          ?? throw new BusinessException("Charging station not found.");

            var now = DateTime.UtcNow;
            var hasBookings = await _bookings.FindAsync(b =>
                b.StationId == id &&
                (b.Status == "Pending" || b.Status == "Approved" || b.Status == "InProgress") &&
                b.EndTime >= now);

            if (hasBookings.Count() > 0)
                throw new BusinessException("Cannot delete: station has active or upcoming bookings.");

            await _stations.DeleteAsync(id);
        }


        //  Slots (CRUD) 
        public async Task<List<Slot>> GetSlotsAsync(string stationId)
        {
            var station = await _stations.GetByIdAsync(stationId)
                          ?? throw new BusinessException("Charging station not found.");
            return station.Slots.OrderBy(s => s.Code).ToList();
        }

        public async Task<Slot> AddSlotAsync(string stationId, CreateSlotDto dto)
        {
            var station = await _stations.GetByIdAsync(stationId)
                          ?? throw new BusinessException("Charging station not found.");

            if (station.Slots.Any(s => s.Code.ToLower() == dto.Code.Trim().ToLower()))
                throw new BusinessException("A slot with the same code already exists.");

            var slot = MapCreateSlot(dto);
            station.Slots.Add(slot);
            station.UpdatedAt = DateTime.UtcNow;

            await _stations.UpdateAsync(stationId, station);
            return slot;
        }

        public async Task UpdateSlotAsync(string stationId, string slotId, UpdateSlotDto dto)
        {
            var station = await _stations.GetByIdAsync(stationId)
                          ?? throw new BusinessException("Charging station not found.");

            var slot = station.Slots.FirstOrDefault(s => s.Id == slotId)
                       ?? throw new BusinessException("Slot not found.");

            if (!string.Equals(slot.Code, dto.Code, StringComparison.OrdinalIgnoreCase) &&
                station.Slots.Any(s => s.Code.ToLower() == dto.Code.Trim().ToLower()))
            {
                throw new BusinessException("A slot with the same code already exists.");
            }

            slot.Code = dto.Code.Trim();
            slot.ConnectorType = dto.ConnectorType;
            slot.PowerKw = dto.PowerKw;
            slot.IsActive = dto.IsActive;

            station.UpdatedAt = DateTime.UtcNow;
            await _stations.UpdateAsync(stationId, station);
        }

        public async Task DeactivateSlotAsync(string stationId, string slotId)
        {
            var station = await _stations.GetByIdAsync(stationId)
                          ?? throw new BusinessException("Charging station not found.");

            var slot = station.Slots.FirstOrDefault(s => s.Id == slotId)
                       ?? throw new BusinessException("Slot not found.");

            var now = DateTime.UtcNow;
            var hasActive = await _bookings.FindAsync(b =>
                b.StationId == stationId &&
                b.SlotId == slotId &&
                (b.Status == "Pending" || b.Status == "Approved" || b.Status == "InProgress") &&
                b.EndTime >= now);

            if (hasActive.Count() > 0)
                throw new BusinessException("Cannot deactivate: slot has active or upcoming bookings.");

            slot.IsActive = false;
            station.UpdatedAt = DateTime.UtcNow;
            await _stations.UpdateAsync(stationId, station);
        }

        public async Task DeleteSlotAsync(string stationId, string slotId)
        {
            var station = await _stations.GetByIdAsync(stationId)
                          ?? throw new BusinessException("Charging station not found.");

            var now = DateTime.UtcNow;
            var hasActive = await _bookings.FindAsync(b =>
                b.StationId == stationId &&
                b.SlotId == slotId &&
                (b.Status == "Pending" || b.Status == "Approved" || b.Status == "InProgress") &&
                b.EndTime >= now);

            if (hasActive.Count() > 0)
                throw new BusinessException("Cannot delete: slot has active or upcoming bookings.");

            var removed = station.Slots.RemoveAll(s => s.Id == slotId);
            if (removed == 0) throw new BusinessException("Slot not found.");

            station.UpdatedAt = DateTime.UtcNow;
            await _stations.UpdateAsync(stationId, station);
        }

        //  Nearby 
        public async Task<List<ChargingStation>> GetNearbyAsync(
            double lat, double lng, double radiusKm, string? type = null, DateTime? availableAtUtc = null)
        {
            var all = await GetAllAsync(type, true);

            return all.Where(s =>
            {
                var d = HaversineKm(lat, lng, s.Latitude, s.Longitude);
                if (d > radiusKm) return false;

                // Must have at least one active slot
                var activeSlots = s.Slots.Count(sl => sl.IsActive);
                if (activeSlots == 0) return false;

                if (availableAtUtc.HasValue)
                {
                    var t = availableAtUtc.Value.ToUniversalTime();
                    var dow = (int)t.DayOfWeek;
                    var hhmm = t.TimeOfDay;

                    var hasWindow = s.Schedules.Any(w =>
                        w.DayOfWeek == dow &&
                        ParseTime(w.StartTime) <= hhmm &&
                        hhmm < ParseTime(w.EndTime) &&
                        w.SlotCount > 0);
                    if (!hasWindow) return false;
                }

                return true;
            }).ToList();
        }

        //  Helpers 
        private static ScheduleWindow MapWindow(ScheduleWindowDto dto) => new()
        {
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            SlotCount = dto.SlotCount
        };

        private static Slot MapCreateSlot(CreateSlotDto dto) => new()
        {
            Id = Guid.NewGuid().ToString("N"),
            Code = dto.Code.Trim(),
            ConnectorType = dto.ConnectorType,
            PowerKw = dto.PowerKw,
            IsActive = dto.IsActive
        };

        private static void ValidateSchedule(IEnumerable<ScheduleWindowDto> windows)
        {
            var list = windows.ToList();
            if (list.Any(w => w.SlotCount < 0))
                throw new BusinessException("SlotCount must be >= 0.");

            if (list.Any(w => string.IsNullOrWhiteSpace(w.StartTime) || string.IsNullOrWhiteSpace(w.EndTime)))
                throw new BusinessException("StartTime and EndTime are required for each schedule window.");

            foreach (var g in list.GroupBy(w => w.DayOfWeek))
            {
                var ordered = g.Select(w => new
                {
                    Start = ParseTime(w.StartTime),
                    End = ParseTime(w.EndTime)
                })
                .OrderBy(x => x.Start)
                .ToList();

                foreach (var win in ordered)
                {
                    if (win.End <= win.Start)
                        throw new BusinessException("EndTime must be after StartTime.");
                }

                for (int i = 1; i < ordered.Count; i++)
                {
                    if (ordered[i].Start < ordered[i - 1].End)
                        throw new BusinessException("Schedule windows must not overlap for the same day.");
                }
            }
        }

        private static TimeSpan ParseTime(string hhmm)
        {
            if (!TimeSpan.TryParse(hhmm, out var ts))
                throw new BusinessException($"Invalid time format: {hhmm}. Use HH:mm (24h).");
            return ts;
        }

        private static double HaversineKm(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371.0;
            double dLat = ToRad(lat2 - lat1);
            double dLon = ToRad(lon2 - lon1);
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double ToRad(double deg) => deg * Math.PI / 180.0;
    }
}
