// <copyright file="AuthController.cs" company="SLIIT">
// Author: Your Name
// Date: 2025-09-25
// Description: Controller for authentication.
// </copyright>

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebService.Models;
using WebService.Services.Interfaces;
using WebService.Models;
using WebService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        // Register web user (Backoffice only, but no auth yet)
        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register(User user)
        {
            var id = await _service.RegisterUserAsync(user);
            return CreatedAtAction(nameof(Register), new { id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _service.loginAsync(request.Username, request.Password);
            return Ok(new { Token = token });
        }

        // Login EV Owner
        [HttpPost("evowner-login")]
        public async Task<IActionResult> EVOwnerLogin([FromBody] EVLoginRequest request)
        {
            var token = await _service.EVOwnerLoginAsync(request.NIC);
            return Ok(new { Token = token });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class EVLoginRequest
    {
        public string NIC { get; set; }
    }
}