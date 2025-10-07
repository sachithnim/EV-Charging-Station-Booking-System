using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebService.Models;
using WebService.Services.Interfaces;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _service;

        public BookingsController(IBookingService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id) => Ok(await _service.GetByIdAsync(id));

        [HttpGet("owner/{nic}")]
        [Authorize]
        public async Task<IActionResult> GetByNic(string nic) => Ok(await _service.GetByNicAsync(nic));

        [HttpPost]
        [Authorize] // EV Owner can create
        public async Task<IActionResult> Create([FromBody] Booking booking)
        {
            var id = await _service.CreateAsync(booking);
            return CreatedAtAction(nameof(GetById), new { id }, booking);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] Booking booking)
        {
            await _service.UpdateAsync(id, booking);
            return NoContent();
        }

        [HttpPatch("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> Cancel(string id)
        {
            await _service.CancelAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/approve")]
        [Authorize(Roles = "Backoffice,StationOperator")]
        public async Task<IActionResult> Approve(string id)
        {
            await _service.ApproveAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/complete")]
        [Authorize(Roles = "StationOperator")]
        public async Task<IActionResult> Complete(string id)
        {
            await _service.CompleteAsync(id);
            return NoContent();
        }
    }
}
