using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;

namespace ToDoApp.Data.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<Category>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await DbSet.AsNoTracking().Where(c => c.UserId == userId).ToListAsync(cancellationToken);
        }
    }
}
