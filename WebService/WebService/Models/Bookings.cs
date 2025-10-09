using MongoDB.Bson.Serialization.Attributes;
using System;

namespace WebService.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Nic { get; set; }

        public required string Name { get; set; }
        public required string StationId { get; set; }
        public required string SlotId { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Status { get; set; } = "Pending";

        public string? QrToken { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
