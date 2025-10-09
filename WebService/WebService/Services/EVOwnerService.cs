using WebService.Dtos;
using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;
using static WebService.Dtos.EVOwnerDto;

namespace WebService.Services
{
    public class EVOwnerService : IEVOwnerService
    {
        private readonly IMongoRepository<EVOwner> _repo;
        private readonly IMongoRepository<Booking> _bookingRepo;

        public EVOwnerService(IMongoRepository<EVOwner> repo, IMongoRepository<Booking> bookingRepo)
        {
            _repo = repo;
            _bookingRepo = bookingRepo;
        }

        // Get all EV Owners
        public async Task<List<EVOwnerDto>> GetAllAsync()
        {
            var owners = await _repo.GetAllAsync();
            return owners
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new EVOwnerDto
                {
                    NIC = o.NIC,
                    Name = o.Name,
                    Email = o.Email,
                    Phone = o.Phone,
                    Address = o.Address,
                    IsActive = o.IsActive
                }).ToList();
        }

        // Get by NIC
        // Get by NIC (with bookings)
        public async Task<EVOwnerDto> GetByNICAsync(string nic)
        {
            var owner = await _repo.GetByIdAsync(nic);
            if (owner == null) throw new BusinessException("EV Owner not found.");

            // Fetch bookings related to this NIC
            var bookings = await _bookingRepo.FindAsync(b => b.Nic == nic);

            // Map bookings to BookingDto list
            var bookingDtos = bookings?
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingDto
                {
                    Id = b.Id!,
                    StationId = b.StationId,
                    SlotId = b.SlotId,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status,
                    QrToken = b.QrToken
                }).ToList();

            // Return owner with bookings
            return new EVOwnerDto
            {
                NIC = owner.NIC,
                Name = owner.Name,
                Email = owner.Email,
                Phone = owner.Phone,
                Address = owner.Address,
                IsActive = owner.IsActive,
                Bookings = bookingDtos
            };
        }

        // Create EV Owner
        public async Task<string> CreateAsync(EVOwner owner)
        {
            if (await _repo.GetByIdAsync(owner.NIC) != null) throw new BusinessException("NIC already exists.");
            if (await _repo.FindAsync(o => o.Email == owner.Email) is { Count: > 0 }) throw new BusinessException("Email already exists.");
            owner.Password = BCrypt.Net.BCrypt.HashPassword(owner.Password);
            await _repo.CreateAsync(owner);
            return owner.NIC;
        }

        // Update EV Owner (Profile only)
        public async Task UpdateAsync(string nic, UpdateEvOwnerDto owner)
        {
            var existing = await _repo.GetByIdAsync(nic);
            if (existing == null)
                throw new BusinessException("EV Owner not found.");

            // Validate unique email if changed
            if (owner.Email != existing.Email &&
                await _repo.FindAsync(o => o.Email == owner.Email) is { Count: > 0 })
                throw new BusinessException("Email already exists.");

            // Only update profile fields
            existing.Name = owner.Name;
            existing.Email = owner.Email;
            existing.Phone = owner.Phone;
            existing.Address = owner.Address;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(nic, existing);
        }

        // Update EV Owner
        // Change Password
        public async Task ChangePasswordAsync(string nic, string oldPassword, string newPassword)
        {
            var owner = await _repo.GetByIdAsync(nic);
            if (owner == null)
                throw new BusinessException("EV Owner not found.");

            // Validate old password
            if (!BCrypt.Net.BCrypt.Verify(oldPassword, owner.Password))
                throw new BusinessException("Old password is incorrect.");

            // Hash and update new password
            owner.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            owner.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(nic, owner);
        }

        // Delete EV Owner
        public async Task DeleteAsync(string nic)
        {
            if (await _repo.GetByIdAsync(nic) == null) throw new BusinessException("EV Owner not found.");
            await _repo.DeleteAsync(nic);
        }

        // Activate EV Owner (only Backoffice)
        public async Task ActivateAsync(string nic)
        {
            var owner = await _repo.GetByIdAsync(nic);
            if (owner == null) throw new BusinessException("EV Owner not found.");
            owner.IsActive = true;
            await _repo.UpdateAsync(nic, owner);
        }

        // Deactivate EV Owner
        public async Task DeactivateAsync(string nic)
        {
            var owner = await _repo.GetByIdAsync(nic);
            if (owner == null) throw new BusinessException("EV Owner not found.");
            owner.IsActive = false;
            await _repo.UpdateAsync(nic, owner);
        }
    }
}