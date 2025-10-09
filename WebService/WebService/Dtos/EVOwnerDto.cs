namespace WebService.Dtos
{
    public class EVOwnerDto
    {
        public string NIC { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; }

        public List<BookingDto>? Bookings { get; set; }

        public class BookingDto
    {
        public string Id { get; set; }
        public string StationId { get; set; }
        public string SlotId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
        public string? QrToken { get; set; }
    }
   
    }
}