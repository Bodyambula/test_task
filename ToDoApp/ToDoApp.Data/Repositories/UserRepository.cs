using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;

namespace ToDoApp.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context)
            : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            return await DbSet.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        }
    }
}
