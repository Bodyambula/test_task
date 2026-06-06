using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Entities.Entities
{
    public class TaskItem : BaseEntity
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;

        public DateTime? DueDate { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public int? CategoryId { get; set; }

        public Category? Category { get; set; }
    }
}
