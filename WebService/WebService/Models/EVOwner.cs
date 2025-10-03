using MongoDB.Bson.Serialization.Attributes;

namespace WebService.Models
{
    public class EVOwner
    {
        [BsonId]
        public string NIC { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; } = true;
        
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime? UpdatedAt { get; set; }
    }
}
