using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApi.Data;
using webApi.Models;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/labels")]
    public class LabelsController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public LabelsController(TaskDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Label>>> GetLabels()
        {
            var labels = await _context.Labels
                .OrderBy(label => label.Name)
                .ToListAsync();

            return Ok(labels);
        }
    }
}
