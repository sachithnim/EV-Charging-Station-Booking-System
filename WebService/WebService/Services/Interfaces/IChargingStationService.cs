using WebService.Dtos;
using WebService.Models;

namespace WebService.Services.Interfaces
{
    public interface IChargingStationService
    {
        // Stations
        Task<List<ChargingStation>> GetAllAsync(string? type = null, bool? isActive = null);
        Task<ChargingStation?> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateStationDto dto, string? userId = null);
        Task UpdateDetailsAsync(string id, UpdateStationDto dto, string? userId = null);
        Task UpdateScheduleAsync(string id, List<ScheduleWindowDto> schedule, string? userId = null);
        Task ActivateStationAsync(string id);
        Task DeactivateStationAsync(string id);
        Task DeleteStationAsync(string id);


        // Slots (CRUD)
        Task<List<Slot>> GetSlotsAsync(string stationId);
        Task<Slot> AddSlotAsync(string stationId, CreateSlotDto dto);
        Task UpdateSlotAsync(string stationId, string slotId, UpdateSlotDto dto);
        Task DeactivateSlotAsync(string stationId, string slotId);
        Task DeleteSlotAsync(string stationId, string slotId);

        // Nearby
        Task<List<ChargingStation>> GetNearbyAsync(
            double lat, double lng, double radiusKm, string? type = null, DateTime? availableAtUtc = null);
    }
}
