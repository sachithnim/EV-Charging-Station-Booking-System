namespace WebService.Dtos
{
    public class CreateSlotDto
    {
        public string Code { get; set; } = default!;
        public string? ConnectorType { get; set; } // e.g., "Type2"
        public double? PowerKw { get; set; }       // e.g., 22
        public bool IsActive { get; set; } = true;
    }
}
