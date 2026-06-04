using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;

namespace ToDoApp.Data.Repositories
{
    public class TaskRepository : BaseRepository<TaskItem>, ITaskRepository
    {
        public TaskRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(t => t.Category)
                .Where(t => t.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<TaskItem>> GetByCategoryIdAsync(int categoryId, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(t => t.CategoryId == categoryId).ToListAsync(cancellationToken);
        }
    }
}
