using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Entities.Entities
{
    public class User : BaseEntity, ISoftDelete
    {
        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public ICollection<Category> Categories { get; set; } = new List<Category>();

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

        // Used to flag soft-deleted records. Do not manually modify this unless bypassing the repository's soft delete system is intended.
        public bool IsDeleted { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}
