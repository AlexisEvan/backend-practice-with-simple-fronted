using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApi.Data;
using webApi.Models;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/todos")]
    public class TaskItemsController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public TaskItemsController(TaskDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskItem>>> GetTodos()
        {
            var todos = await _context.TaskItems
                .Include(t => t.Label)
                .ToListAsync();

            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTodoById(int id)
        {
            var task = await _context.TaskItems
                .Include(t => t.Label)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTodo(TaskItem taskItem)
        {
            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodoById), new { id = taskItem.Id }, taskItem);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItem>> UpdateTodo(int id, TaskItem updatedTask)
        {
            var existingTask = await _context.TaskItems.FindAsync(id);

            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Title = updatedTask.Title;
            existingTask.IsComplete = updatedTask.IsComplete;
            existingTask.LabelId = updatedTask.LabelId;

            await _context.SaveChangesAsync();

            return Ok(existingTask);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTodo(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
