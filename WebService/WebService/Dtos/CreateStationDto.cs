namespace WebService.Dtos
{
    public class CreateStationDto
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Type { get; set; } = "AC";

        public List<ScheduleWindowDto> Schedules { get; set; } = new();
        public List<CreateSlotDto> Slots { get; set; } = new();
    }
}
