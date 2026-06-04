using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace ToDoApp.Entities.Interfaces
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
        Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);
    }
}
