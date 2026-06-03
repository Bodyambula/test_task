using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models.Task
{
    public class CreateTaskModel
    {
        [Required(ErrorMessage = "Заголовок завдання є обов'язковим")]
        [StringLength(100, ErrorMessage = "Заголовок не може бути довшим за 100 символів")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Опис не може бути довшим за 500 symbols")]
        public string Description { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        // Необов'язкове поле: якщо користувач не обрав категорію, прийде null
        public int? CategoryId { get; set; }
    }
}