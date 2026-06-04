using System;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Entities.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ICategoryRepository Categories { get; }
        ITaskRepository Tasks { get; }
        IBaseRepository<TEntity> Repository<TEntity>() where TEntity : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
