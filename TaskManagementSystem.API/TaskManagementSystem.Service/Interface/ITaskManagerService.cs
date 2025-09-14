using TaskManagementSystem.Service.Models;
using TaskManagementSystem.Service.Utility;

namespace TaskManagementSystem.Service.Interface
{
    public interface ITaskManagerService
    {
        Task<ApiResponse<dynamic>> GetTasks();

        Task<ApiResponse<bool>> CreateTask(TaskItem dto);

        Task<ApiResponse<bool>> UpdateTask(Guid id, TaskItem task);

        Task<ApiResponse<bool>> DeleteTask(Guid id);
    }
}
