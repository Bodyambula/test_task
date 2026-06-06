using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<TaskItem> Tasks { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is ISoftDelete && e.State == EntityState.Deleted);

            foreach (var entry in entries)
            {
                // Prevent physical deletion of entities implementing ISoftDelete.
                // We transition the state to Modified and set the deletion flags instead of performing a SQL DELETE.
                entry.State = EntityState.Modified;

                var entity = (ISoftDelete)entry.Entity;
                entity.IsDeleted = true;
                entity.DeletedAt = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Automatically exclude soft-deleted users from all SELECT queries by default.
            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
        }
    }
}