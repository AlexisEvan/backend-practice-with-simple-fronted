using System.Text.Json.Serialization;

namespace webApi.Models
{
    public class Label
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Color { get; set; } = string.Empty;

        // One Label has many TaskItems
        [JsonIgnore]
        public List<TaskItem> TaskItems { get; set; } = new();
    }
}
