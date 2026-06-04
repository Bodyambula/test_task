using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Entities.Interfaces
{
    public interface ITaskRepository : IBaseRepository<TaskItem>
    {
        Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<TaskItem>> GetByCategoryIdAsync(int categoryId, CancellationToken cancellationToken = default);
        Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
            int userId, 
            int page, 
            int pageSize, 
            bool? isCompleted, 
            int? categoryId, 
            CancellationToken cancellationToken = default);
    }
}
