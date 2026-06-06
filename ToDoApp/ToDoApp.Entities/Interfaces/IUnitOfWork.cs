using System;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Entities.Interfaces
{
    // Coordinates operations across multiple repositories by sharing a single database context.
    // WARNING: Always dispose of the Unit of Work scope to prevent memory leaks and database connection exhaustion.
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }

        ICategoryRepository Categories { get; }

        ITaskRepository Tasks { get; }

        IBaseRepository<TEntity> Repository<TEntity>()
            where TEntity : class;

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
