namespace WebService.Dtos
{
    public class UpdateSlotDto
    {
        public string Code { get; set; } = default!;
        public string? ConnectorType { get; set; }
        public double? PowerKw { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
