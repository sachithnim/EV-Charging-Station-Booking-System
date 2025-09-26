using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebService.Services.Interfaces;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _service;

        public ProfileController(IProfileService service)
        {
            _service = service;
        }

        // Get current logged-in user's profile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var identifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(identifier) || string.IsNullOrEmpty(role))
                return Unauthorized("Invalid token.");

            var profile = await _service.GetProfileAsync(identifier, role);
            return Ok(profile);
        }
    }
}
