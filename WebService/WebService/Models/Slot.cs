using MongoDB.Bson.Serialization.Attributes;

namespace WebService.Models
{
    public class Slot
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        public string Code { get; set; } = default!;

        public bool IsActive { get; set; } = true;

        public string? ConnectorType { get; set; }  //  "Type2", "CCS", "CHAdeMO"
        public double? PowerKw { get; set; }        //  7.4, 22, 50
    }
}
