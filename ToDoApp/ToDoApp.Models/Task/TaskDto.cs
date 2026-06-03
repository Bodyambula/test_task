using ToDoApp.Models.Category;

namespace ToDoApp.Models.Task
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }

        // Зручно для фронтенду, щоб відразу показати, до якої категорії належить таска
        public CategoryDto? Category { get; set; }
    }
}