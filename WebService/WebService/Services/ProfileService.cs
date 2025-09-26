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

        // Fetch profile based on role and identifier
        public async Task<UserProfile> GetProfileAsync(string identifier, string role)
        {
            if (role == "Backoffice" || role == "StationOperator")
            {
                var user = (await _userRepo.FindAsync(u => u.Username == identifier)).FirstOrDefault();
                if (user == null) throw new BusinessException("User not found.");
                return new UserProfile
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
                return new UserProfile
                {
                    Identifier = owner.NIC,
                    Role = "EVOwner",
                    Name = owner.Name,
                    Email = owner.Email,
                    Phone = owner.Phone,
                    IsActive = owner.IsActive
                };
            }
            throw new BusinessException("Invalid role.");
        }
    }
}
