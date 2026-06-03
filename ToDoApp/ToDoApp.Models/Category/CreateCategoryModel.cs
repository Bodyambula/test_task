using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models.Category
{
    public class CreateCategoryModel
    {
        [Required(ErrorMessage = "Назва категорії є обов'язковою")]
        [StringLength(50, ErrorMessage = "Назва не може бути довшою за 50 символів")]
        public string Name { get; set; } = string.Empty;
    }
}