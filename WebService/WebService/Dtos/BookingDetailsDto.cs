namespace WebService.Dtos
{
    public class BookingDetailsDto
    {
        public string Id { get; set; } = default!;
        public string Nic { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Status { get; set; } = default!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }


        public string StationId { get; set; } = default!;
        public string StationName { get; set; } = default!;
        public string StationAddress { get; set; } = default!;
        public string StationType { get; set; } = default!;

        public string SlotId { get; set; } = default!;
        public string SlotCode { get; set; } = default!;
        public string ConnectorType { get; set; } = default!;
        public double PowerKw { get; set; }
    }
}
