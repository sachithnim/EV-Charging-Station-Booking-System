using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;

namespace WebService.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IMongoRepository<User> _userRepo;
        private readonly IMongoRepository<EVOwner> _evOwnerRepo;

        public ProfileService(IMongoRepository<User> userRepo, IMongoRepository<EVOwner> evOwnerRepo)
        {
            _userRepo = userRepo;
            _evOwnerRepo = evOwnerRepo;
        }

       public async Task<UserProfile> GetProfileAsync(string identifier, string role)
        {
            UserProfile profile;

            if (role == "Backoffice" || role == "StationOperator" || role == "Admin")
            {
                var user = (await _userRepo.FindAsync(u => u.Username == identifier)).FirstOrDefault();
                if (user == null) throw new BusinessException("User not found.");

                profile = new UserProfile
                {
                    Identifier = user.Username,
                    Role = user.Role,
                    Email = user.Email,
                };
            }
            else if (role == "EVOwner")
            {
                var owner = await _evOwnerRepo.GetByIdAsync(identifier);
                if (owner == null) throw new BusinessException("EV Owner not found.");

                profile = new UserProfile
                {
                    Identifier = owner.NIC,
                    Role = "EVOwner",
                    Name = owner.Name,
                    Email = owner.Email,
                    Phone = owner.Phone,
                    IsActive = owner.IsActive
                };
            }
            else
            {
                throw new BusinessException("Invalid role.");
            }

            // Attach functions dynamically based on role
            profile.Functions = GetFunctionsForRole(profile.Role);
            return profile;
        }

        private List<string> GetFunctionsForRole(string role)
        {
            return role switch
            {
                "Admin" => new List<string> { "Dashboard", "EV Owners", "Charging Stations", "Bookings", "Reports", "Users" },
                "Backoffice" => new List<string> { "Dashboard", "EV Owners", "Charging Stations", "Bookings" },
                "StationOperator" => new List<string> { "Dashboard", "Charging Stations","Charging Stations", "Bookings" },
                "EVOwner" => new List<string> { "My Profile", "My Bookings", "Payments" },
                _ => new List<string>()
            };
        }
    }
}
