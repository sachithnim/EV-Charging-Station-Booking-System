using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebService.Models
{
    [BsonIgnoreExtraElements]
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string StationId { get; set; } = default!;

        // used for guards on slot delete/deactivate
        public string? SlotId { get; set; }

        // "Pending" | "Approved" | "InProgress" | "Completed" | "Cancelled"
        public string Status { get; set; } = "Pending";

        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
    }
}
