namespace WebService.Models
{
    public class UserProfile
    {
        public string Identifier { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool IsActive { get; set; }
        
        public List<string> Functions { get; set; } = new();
    }
}
