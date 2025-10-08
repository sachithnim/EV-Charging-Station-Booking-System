namespace WebService.Models
{
    public class ScheduleWindow
    {
        // 0=Sunday - 6=Saturday
        public int DayOfWeek { get; set; }

        // "HH:mm" 24h format
        public string StartTime { get; set; } = default!;
        public string EndTime { get; set; } = default!;

        // Available capacity during this window
        public int SlotCount { get; set; }
    }
}
