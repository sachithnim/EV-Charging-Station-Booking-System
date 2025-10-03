using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebService.Models;
using WebService.Services.Interfaces;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EVOwnersController : ControllerBase
    {
        private readonly IEVOwnerService _service;

        public EVOwnersController(IEVOwnerService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Backoffice,Admin,StationOperator")]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{nic}")]
        [Authorize(Roles = "Backoffice")]
        public async Task<IActionResult> GetByNIC(string nic) => Ok(await _service.GetByNICAsync(nic));

        [HttpPost]
        public async Task<IActionResult> Create(EVOwner owner)
        {
            await _service.CreateAsync(owner);
            return CreatedAtAction(nameof(GetByNIC), new { nic = owner.NIC }, owner);
        }

        [HttpPut("{nic}")]
        [Authorize]
        public async Task<IActionResult> Update(string nic, EVOwner owner)
        {
            await _service.UpdateAsync(nic, owner);
            return NoContent();
        }

        [HttpDelete("{nic}")]
        [Authorize]
        public async Task<IActionResult> Delete(string nic)
        {
            await _service.DeleteAsync(nic);
            return NoContent();
        }

        [HttpPost("{nic}/activate")]
        [Authorize(Roles = "Backoffice,Admin")]
        public async Task<IActionResult> Activate(string nic)
        {
            await _service.ActivateAsync(nic);
            return NoContent();
        }

        [HttpPost("{nic}/deactivate")]
        [Authorize]
        public async Task<IActionResult> Deactivate(string nic)
        {
            await _service.DeactivateAsync(nic);
            return NoContent();
        }
    }
}