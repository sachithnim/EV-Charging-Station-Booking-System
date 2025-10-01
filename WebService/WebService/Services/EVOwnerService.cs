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
        public async Task<List<EVOwner>> GetAllAsync() => await _repo.GetAllAsync();

        // Get by NIC
        public async Task<EVOwner> GetByNICAsync(string nic) => await _repo.GetByIdAsync(nic);

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