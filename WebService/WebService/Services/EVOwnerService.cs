using WebService.Dtos;
using WebService.Exceptions;
using WebService.Models;
using WebService.Repositories.Interfaces;
using WebService.Services.Interfaces;

namespace WebService.Services
{
    public class EVOwnerService : IEVOwnerService
    {
        private readonly IMongoRepository<EVOwner> _repo;

        public EVOwnerService(IMongoRepository<EVOwner> repo)
        {
            _repo = repo;
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
        public async Task<EVOwnerDto> GetByNICAsync(string nic)
        {
            var owner = await _repo.GetByIdAsync(nic);
            if (owner == null) throw new BusinessException("EV Owner not found.");
            return new EVOwnerDto
            {
                NIC = owner.NIC,
                Name = owner.Name,
                Email = owner.Email,
                Phone = owner.Phone,
                Address = owner.Address,
                IsActive = owner.IsActive
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

        // Update EV Owner
        public async Task UpdateAsync(string nic, EVOwner owner)
        {
            var existing = await _repo.GetByIdAsync(nic);
            if (existing == null) throw new BusinessException("EV Owner not found.");
            owner.NIC = nic; // Prevent changing PK
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