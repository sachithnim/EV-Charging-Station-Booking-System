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
    // add only the fields you want to expose
    }
}