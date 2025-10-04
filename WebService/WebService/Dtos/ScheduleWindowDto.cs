namespace WebService.Dtos
{
    public class ScheduleWindowDto
    {
        public int DayOfWeek { get; set; }          // 0..6
        public string StartTime { get; set; } = default!; // "HH:mm"
        public string EndTime { get; set; } = default!;
        public int SlotCount { get; set; }
    }
}
