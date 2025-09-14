using Microsoft.AspNetCore.Identity;
using TaskManagementSystem.DataAccess.DTO;
using TaskManagementSystem.Service.Models;
using TaskManagementSystem.Service.Utility;

namespace TaskManagementSystem.Service.Interface
{
    public interface IUserService
    {
        Task<ApiResponse<IdentityResult>> Register(Registration registration);

        Task<ApiResponse<LoginResponse>> Login(LoginRequest login);

        Task<User> FindByNameAsync(string username);

        Task<ApiResponse<dynamic>> GetAllUsers();
    }
}
