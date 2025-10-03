using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebService.Models
{
    public class ChargingStation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string Type { get; set; } = "AC"; // "AC" or "DC"

        public bool IsActive { get; set; } = true;

        // Station-level operating schedule (timing + concurrent capacity)
        public List<ScheduleWindow> Schedules { get; set; } = new();

        // Physical bays/ports with IDs (user can select a specific one)
        public List<Slot> Slots { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
