using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities.Interfaces;

namespace ToDoApp.Data.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : class
    {
        private readonly AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            DbSet = _context.Set<TEntity>();
        }

        protected DbSet<TEntity> DbSet { get; }

        public virtual async Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await DbSet.FindAsync(new object[] { id }, cancellationToken);
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await DbSet.ToListAsync(cancellationToken);
        }

        public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await DbSet.Where(predicate).ToListAsync(cancellationToken);
        }

        public virtual async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            await DbSet.AddAsync(entity, cancellationToken);
        }

        public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
        {
            await DbSet.AddRangeAsync(entities, cancellationToken);
        }

        public virtual void Update(TEntity entity)
        {
            DbSet.Update(entity);
        }

        // WARNING: If the entity type implements ISoftDelete, these methods will not physically
        // delete the records from the database. Instead, AppDbContext intercepts the operation
        // and transitions the entity to Modified state with IsDeleted set to true.
        public virtual void Delete(TEntity entity)
        {
            DbSet.Remove(entity);
        }

        public virtual void DeleteRange(IEnumerable<TEntity> entities)
        {
            DbSet.RemoveRange(entities);
        }
    }
}
