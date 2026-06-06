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
        public TaskRepository(AppDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Include(t => t.Category)
                .Where(t => t.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<TaskItem>> GetByCategoryIdAsync(int categoryId, CancellationToken cancellationToken = default)
        {
            return await DbSet.Where(t => t.CategoryId == categoryId).ToListAsync(cancellationToken);
        }

        public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
            int userId,
            int page,
            int pageSize,
            bool? isCompleted,
            int? categoryId,
            string? search,
            CancellationToken cancellationToken = default)
        {
            var query = DbSet.Include(t => t.Category).Where(t => t.UserId == userId);

            if (isCompleted.HasValue)
            {
                query = query.Where(t => t.IsCompleted == isCompleted.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(lowerSearch) ||
                                         t.Description.ToLower().Contains(lowerSearch));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }
    }
}
