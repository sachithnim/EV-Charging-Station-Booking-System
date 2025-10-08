namespace WebService.Dtos
{
    public class UpdateStationDto
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Type { get; set; } = "AC";
        public bool IsActive { get; set; } = true;

        // If provided, full replace of schedule
        public List<ScheduleWindowDto>? Schedules { get; set; }
    }
}
