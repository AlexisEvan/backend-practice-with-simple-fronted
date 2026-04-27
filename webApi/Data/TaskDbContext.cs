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
        public DbSet<Label> Labels => Set<Label>();
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Label>().HasData(
                new Label
                {
                    Id = 1,
                    Name = "Personal",
                    Description = "Personal tasks",
                    Color = "#3B82F6"
                },
                new Label
                {
                    Id = 2,
                    Name = "Work",
                    Description = "Work tasks",
                    Color = "#10B981"
                }
            );

            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Learn fronted",
                    IsComplete = false,
                    LabelId = 1
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "learn backend",
                    IsComplete = true,
                    LabelId = 1
                },
                new TaskItem
                {
                    Id = 3,
                    Title = "Finish report",
                    IsComplete = false,
                    LabelId = 2
                }
            );
        }
    }
}
