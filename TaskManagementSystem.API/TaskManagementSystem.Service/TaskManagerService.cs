using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TaskManagementSystem.DataAccess;
using TaskManagementSystem.DataAccess.DTO;
using TaskManagementSystem.Service.Interface;
using TaskManagementSystem.Service.Models;
using TaskManagementSystem.Service.Utility;

namespace TaskManagementSystem.Service
{
    public class TaskManagerService : ITaskManagerService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ITransactionService _transactionService;
        private readonly IHubContext<LiveTaskStatus> _statusContext;
        private readonly ILogger<TaskManagerService> _logger;

        public TaskManagerService(
            ApplicationDbContext dbContext,
            ITransactionService transactionService,
            IHubContext<LiveTaskStatus> statusContext,
            ILogger<TaskManagerService> logger)
        {
            _dbContext = dbContext;
            _transactionService = transactionService;
            _statusContext = statusContext;
            _logger = logger;
        }

        public async Task<ApiResponse<dynamic>> GetTasks()
        {
            _logger.LogInformation("Fetching all tasks from database...");

            var tasks = await _dbContext.Tasks
                .Include(t => t.Assignee)
                .Include(t => t.Creator)
                .Select(t => new
                {
                    ID = t.ID,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    AssigneeID = t.AssigneeID,
                    AssigneeEmail = t.Assignee.Email,
                    CreatorID = t.CreatorID,
                    CreatorEmail = t.Creator.Email,
                    CreatedAt = t.CreatedAt,
                    ModifiedAt = t.ModifiedAt
                })
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} tasks.", tasks.Count);

            return new ApiResponse<dynamic>(tasks, "Get Tasks !!");
        }

        public async Task<ApiResponse<bool>> CreateTask(TaskItem dto)
        {
            _logger.LogInformation("Creating task with title: {Title} by user: {Email}", dto.Title, dto.Email);

            await _transactionService.ExecuteAsync(async () =>
            {
                var user = _dbContext.Users.FirstOrDefault(x => x.Email == dto.Email);
                if (user == null)
                {
                    _logger.LogWarning("Task creation failed. Creator with email {Email} not found.", dto.Email);
                    throw new Exception("Creator user not found");
                }

                var task = new TaskManager
                {
                    ID = Guid.NewGuid(),
                    Title = dto.Title,
                    Description = dto.Description,
                    Status = dto.Status,
                    Priority = dto.Priority,
                    AssigneeID = dto.AssigneeID,
                    CreatorID = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    ModifiedAt = DateTime.UtcNow
                };

                _dbContext.Tasks.Add(task);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Task created successfully. TaskId: {TaskId}", task.ID);
            });

            return new ApiResponse<bool>(true, "Task created successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateTask(Guid id, TaskItem dto)
        {
            _logger.LogInformation("Updating task with ID: {TaskId}", id);

            await _transactionService.ExecuteAsync(async () =>
            {
                var task = _dbContext.Tasks.FirstOrDefault(x => x.ID == id);
                if (task == null)
                {
                    _logger.LogWarning("Task update failed. TaskId {TaskId} not found.", id);
                    throw new Exception("Task not found");
                }

                task.Title = dto.Title;
                task.Description = dto.Description;
                task.Status = dto.Status;
                task.Priority = dto.Priority;
                task.AssigneeID = dto.AssigneeID;
                task.ModifiedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();
                await _statusContext.Clients.All.SendAsync("ReceiveTaskUpdate", id, dto.Status);

                _logger.LogInformation("Task updated successfully. TaskId: {TaskId}", id);
            });

            return new ApiResponse<bool>(true, "Task update successfully.");
        }

        public async Task<ApiResponse<bool>> DeleteTask(Guid id)
        {
            _logger.LogInformation("Deleting task with ID: {TaskId}", id);

            await _transactionService.ExecuteAsync(async () =>
            {
                var task = _dbContext.Tasks.FirstOrDefault(x => x.ID == id);
                if (task == null)
                {
                    _logger.LogWarning("Task deletion failed. TaskId {TaskId} not found.", id);
                    throw new Exception("Task not found");
                }

                _dbContext.Tasks.Remove(task);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Task deleted successfully. TaskId: {TaskId}", id);
            });

            return new ApiResponse<bool>(true, "Task deleted successfully");
        }
    }
}
