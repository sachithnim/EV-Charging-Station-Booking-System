using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;
using BCrypt.Net;
using WebService.Exceptions;
using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;

namespace WebService.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMongoRepository<User> _userRepo;
        private readonly IMongoRepository<EVOwner> _evOwnerRepo;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IMongoRepository<User> userRepo, IMongoRepository<EVOwner> evOwnerRepo, IOptions<JwtSettings> jwtSettings)
        {
            _userRepo = userRepo;
            _evOwnerRepo = evOwnerRepo;
            _jwtSettings = jwtSettings.Value;
        }

        // Register web user (Backoffice or StationOperator)
        public async Task<string> RegisterUserAsync(User user)
        {
            var existing = (await _userRepo.FindAsync(u => u.Username == user.Username));
            if (existing.Count > 0) throw new BusinessException("Username already exists.");
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _userRepo.CreateAsync(user);
            return user.Id;
        }

        // Login web user and generate JWT
        public async Task<string> loginAsync(string username, string password)
        {
            var users = await _userRepo.FindAsync(u => u.Username == username);
            var user = users.FirstOrDefault();
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) throw new BusinessException("Invalid credentials.");

            return GenerateJwt(user.Username, user.Role);
        }

        // Login EV Owner (NIC-based, no password for simplicity)
        public async Task<string> EVOwnerLoginAsync(string nic)
        {
            var owner = await _evOwnerRepo.GetByIdAsync(nic);
            if (owner == null || !owner.IsActive) throw new BusinessException("Invalid or inactive EV Owner.");
            return GenerateJwt(owner.NIC, "EVOwner");
        }

        // Generate JWT token
        private string GenerateJwt(string identifier, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(_jwtSettings.Key);

            if (keyBytes.Length < 32)
            {
                throw new InvalidOperationException(
                    $"JWT signing key is too short. Key length: {keyBytes.Length * 8} bits. " +
                    "It must be at least 256 bits (32 characters if using UTF-8). " +
                    "Update your appsettings.json -> Jwt:Key."
                );
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, identifier),
            new Claim(ClaimTypes.Role, role)
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}

public class JwtSettings
{
    public string Key { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
}