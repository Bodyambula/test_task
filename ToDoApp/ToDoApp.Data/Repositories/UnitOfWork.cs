using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;

namespace ToDoApp.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        // Caches instantiated repositories to ensure a single instance is reused within the Unit of Work scope.
        private readonly ConcurrentDictionary<Type, object> _repositories;
        private bool _disposed;

        public UnitOfWork(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _repositories = new ConcurrentDictionary<Type, object>();
        }

        public IUserRepository Users => (IUserRepository)_repositories.GetOrAdd(typeof(IUserRepository), _ => new UserRepository(_context));

        public ICategoryRepository Categories => (ICategoryRepository)_repositories.GetOrAdd(typeof(ICategoryRepository), _ => new CategoryRepository(_context));

        public ITaskRepository Tasks => (ITaskRepository)_repositories.GetOrAdd(typeof(ITaskRepository), _ => new TaskRepository(_context));

        public IBaseRepository<TEntity> Repository<TEntity>()
            where TEntity : class
        {
            return (IBaseRepository<TEntity>)_repositories.GetOrAdd(typeof(TEntity), _ => new BaseRepository<TEntity>(_context));
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }

                _disposed = true;
            }
        }
    }
}
