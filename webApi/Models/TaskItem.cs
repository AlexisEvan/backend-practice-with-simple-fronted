namespace webApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
        public int? LabelId { get; set; }
        public Label? Label { get; set; }
    }
}