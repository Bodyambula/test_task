using ToDoApp.Entities.Entities;
using ToDoApp.Models.Category;
using ToDoApp.Models.Task;

namespace ToDoApp.Services.Extensions
{
    public static class MappingExtensions
    {
        public static CategoryDto ToDto(this Category category)
        {
            if (category == null)
                return null!;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public static TaskDto ToDto(this TaskItem task)
        {
            if (task == null)
                return null!;

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                Category = task.Category != null ? task.Category.ToDto() : null
            };
        }
    }
}
