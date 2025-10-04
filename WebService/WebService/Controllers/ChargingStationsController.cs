using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebService.Dtos;
using WebService.Services.Interfaces;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChargingStationsController : ControllerBase
    {
        private readonly IChargingStationService _service;

        public ChargingStationsController(IChargingStationService service)
        {
            _service = service;
        }

        // ===== Stations =====
        [HttpGet]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> GetAll([FromQuery] string? type, [FromQuery] bool? isActive)
            => Ok(await _service.GetAllAsync(type, isActive));

        [HttpGet("{id}")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> GetById(string id)
        {
            var s = await _service.GetByIdAsync(id);
            return s is null ? NotFound() : Ok(s);
        }

        [HttpPost]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> Create([FromBody] CreateStationDto dto)
        {
            var user = User?.Identity?.Name;
            var id = await _service.CreateAsync(dto, user);
            var created = await _service.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> UpdateDetails(string id, [FromBody] UpdateStationDto dto)
        {
            var user = User?.Identity?.Name;
            await _service.UpdateDetailsAsync(id, dto, user);
            return NoContent();
        }

        [HttpPut("{id}/schedule")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> UpdateSchedule(string id, [FromBody] List<ScheduleWindowDto> schedule)
        {
            var user = User?.Identity?.Name;
            await _service.UpdateScheduleAsync(id, schedule, user);
            return NoContent();
        }

        [HttpPost("{id}/deactivate")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> DeactivateStation(string id)
        {
            await _service.DeactivateStationAsync(id);
            return NoContent();
        }

        [HttpGet("nearby")]
        [AllowAnonymous]
        public async Task<IActionResult> Nearby(
            [FromQuery] double lat,
            [FromQuery] double lng,
            [FromQuery] double radiusKm = 5,
            [FromQuery] string? type = null,
            [FromQuery] DateTime? availableAt = null)
        {
            var list = await _service.GetNearbyAsync(lat, lng, radiusKm, type, availableAt);
            return Ok(list);
        }

        // ===== Slots =====
        [HttpGet("{stationId}/slots")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> GetSlots(string stationId)
            => Ok(await _service.GetSlotsAsync(stationId));

        [HttpPost("{stationId}/slots")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> AddSlot(string stationId, [FromBody] CreateSlotDto dto)
        {
            var slot = await _service.AddSlotAsync(stationId, dto);
            return CreatedAtAction(nameof(GetSlots), new { stationId }, slot);
        }

        [HttpPut("{stationId}/slots/{slotId}")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> UpdateSlot(string stationId, string slotId, [FromBody] UpdateSlotDto dto)
        {
            await _service.UpdateSlotAsync(stationId, slotId, dto);
            return NoContent();
        }

        [HttpPost("{stationId}/slots/{slotId}/deactivate")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> DeactivateSlot(string stationId, string slotId)
        {
            await _service.DeactivateSlotAsync(stationId, slotId);
            return NoContent();
        }

        [HttpDelete("{stationId}/slots/{slotId}")]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> DeleteSlot(string stationId, string slotId)
        {
            await _service.DeleteSlotAsync(stationId, slotId);
            return NoContent();
        }
    }
}
