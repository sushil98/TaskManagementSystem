using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.Service.Interface;
using TaskManagementSystem.Service.Models;
using TaskManagementSystem.Service.Utility;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class TaskManagerController : ControllerBase
    {
        private readonly ITaskManagerService _taskManager;
        private readonly ILogger<TaskManagerController> _logger;

        public TaskManagerController(ITaskManagerService taskManager, ILogger<TaskManagerController> logger)
        {
            _taskManager = taskManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            _logger.LogInformation("Fetching all tasks...");

            var query = await _taskManager.GetTasks();
            if (query.Success)
            {
                _logger.LogInformation("Successfully fetched {Count} tasks", ((IEnumerable<object>)query.Data).Count());
                return Ok(query);
            }
            else
            {
                _logger.LogWarning("Failed to fetch tasks. Message: {Message}", query.Message);
                return BadRequest(query);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Task creation failed due to invalid model state. Errors: {@Errors}",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList());

                return BadRequest(new ApiResponse<object>(400, false, "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            _logger.LogInformation("Creating a new task with title: {Title}", task.Title);

            var result = await _taskManager.CreateTask(task);
            if (result.Success)
            {
                _logger.LogInformation("Task created successfully. TaskId: {TaskId}", task.AssigneeID);
                return Ok(result);
            }
            else
            {
                _logger.LogError("Task creation failed. Message: {Message}", result.Message);
                return BadRequest(result);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskItem task)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Task update failed due to invalid model state. Errors: {@Errors}",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList());

                return BadRequest(new ApiResponse<object>(400, false, "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            _logger.LogInformation("Updating task with ID: {TaskId}", id);

            var result = await _taskManager.UpdateTask(id, task);
            if (result.Success)
            {
                _logger.LogInformation("Task updated successfully. TaskId: {TaskId}", id);
                return Ok(result);
            }
            else
            {
                _logger.LogError("Task update failed for TaskId {TaskId}. Message: {Message}", id, result.Message);
                return BadRequest(result);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            _logger.LogInformation("Deleting task with ID: {TaskId}", id);

            var result = await _taskManager.DeleteTask(id);
            if (result.Success)
            {
                _logger.LogInformation("Task deleted successfully. TaskId: {TaskId}", id);
                return Ok(result);
            }
            else
            {
                _logger.LogError("Task deletion failed for TaskId {TaskId}. Message: {Message}", id, result.Message);
                return BadRequest(result);
            }
        }
    }
}
