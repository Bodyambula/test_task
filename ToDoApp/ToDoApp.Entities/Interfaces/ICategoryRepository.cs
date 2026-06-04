using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Entities.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<IEnumerable<Category>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    }
}
