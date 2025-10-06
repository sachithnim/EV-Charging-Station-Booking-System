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
        public string StationId { get; set; } = "ST001";
        public string SlotId { get; set; } = "S1";

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string Status { get; set; } = "Pending";
        // Allowed: Pending | Approved | Cancelled | Completed

        public string? QrToken { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
