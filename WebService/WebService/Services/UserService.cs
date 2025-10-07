using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;

namespace WebService.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoRepository<User> _userRepo;

        public UserService(IMongoRepository<User> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<List<User>> GetAllAsync()
        {
            var users = await _userRepo.GetAllAsync();


            var result = users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u =>
                {
                    u.Password = null;
                    return u;
                })
                .ToList();

            return result;
        }

        public async Task<User> GetByIdAsync(string id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) throw new BusinessException("User not found.");
            user.Password = null;
            return user;
        }

        public async Task UpdateAsync(string id, User user)
        {
            var existingUser = await _userRepo.GetByIdAsync(id);
            if (existingUser == null) throw new BusinessException("User not found.");

            // Update fields
            existingUser.Email = user.Email ?? existingUser.Email;
            existingUser.Role = user.Role ?? existingUser.Role;
            existingUser.Username = user.Username ?? existingUser.Username;
            existingUser.UpdatedAt = DateTime.UtcNow;

            await _userRepo.UpdateAsync(id, existingUser);
        }

        public async Task ChangePasswordAsync(string id, string oldPassword, string newPassword)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) throw new BusinessException("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(oldPassword, user.Password))
                throw new BusinessException("Old password is incorrect.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepo.UpdateAsync(id, user);
        }



        public async Task DeleteAsync(string id)
        {
            var existingUser = await _userRepo.GetByIdAsync(id);
            if (existingUser == null) throw new BusinessException("User not found.");

            await _userRepo.DeleteAsync(id);
        }
    }
}