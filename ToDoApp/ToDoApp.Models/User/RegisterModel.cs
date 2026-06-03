using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models.User
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Email є обов'язковим")]
        [EmailAddress(ErrorMessage = "Некоректний формат Email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль є обов'язковим")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль має бути від 6 до 100 символів")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ім'я є обов'язковим")]
        [StringLength(50, ErrorMessage = "Ім'я не може бути довшим за 50 символів")]
        public string Name { get; set; } = string.Empty;
    }
}