using Microsoft.EntityFrameworkCore;
using webApi.Models;

namespace webApi.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> TaskItems => Set<TaskItem>();
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Buy groceries",
                    IsComplete = false
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "Walk the dog",
                    IsComplete = true
                }
            );
        }
    }
}