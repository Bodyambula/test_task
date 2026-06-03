using Microsoft.EntityFrameworkCore;
using ToDoApp.Entities;
using ToDoApp.Entities.Entities; 

namespace ToDoApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
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
                // Скасовуємо жорстке видалення (DELETE) і переводимо в режим оновлення (UPDATE)
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

            // Зв'язок User -> Categories (Один-до-багатьох)
            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Зв'язок User -> Tasks (Один-до-багатьох)
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Зв'язок Category -> Tasks 
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // 2. ГЛОБАЛЬНИЙ ФІЛЬТР ДЛЯ ЮЗЕРІВ
            // Автоматично приховує м'яко видалених користувачів при будь-яких SELECT запитах
            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
        }
    }
}