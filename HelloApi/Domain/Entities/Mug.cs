namespace HelloApi.Domain.Entities
{
    public class Mug
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Stock { get; set; }
    }
}
