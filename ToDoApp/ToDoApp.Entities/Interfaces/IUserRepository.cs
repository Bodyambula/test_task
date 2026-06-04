using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Entities.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    }
}
