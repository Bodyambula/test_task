using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Entities.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
