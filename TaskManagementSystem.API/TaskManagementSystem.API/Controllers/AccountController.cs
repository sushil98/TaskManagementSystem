using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.Service.Interface;
using TaskManagementSystem.Service.Models;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AccountController : ControllerBase
    {
        public readonly IUserService _userService;
        private readonly ILogger<AccountController> _logger;
        public AccountController(IUserService userService, ILogger<AccountController> logger) { 
            _userService = userService;
            _logger = logger;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] Registration registration)
        {
            _logger.LogInformation("Registration attempt for email: {Email}", registration.Email);

            var result = await _userService.Register(registration);

            if (result.Success)
            {
                _logger.LogInformation("User registered successfully with email: {Email}", registration.Email);
                return Ok(result);
            }
            else
            {
                _logger.LogWarning("Registration failed for email: {Email}. Reason: {Message}", registration.Email, result.Message);
                return BadRequest(result);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            _logger.LogInformation("Login attempt for Username: {Username}", login.Username);

            var result = await _userService.Login(login);

            if (result.Success)
            {
                _logger.LogInformation("Login successful for Username: {Username}", login.Username);
                return Ok(result);
            }
            else
            {
                _logger.LogWarning("Login failed for Username: {Username}. Reason: {Message}", login.Username, result.Message);
                return BadRequest(result);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            _logger.LogInformation("Fetching all users");

            var result = await _userService.GetAllUsers();

            if (result.Success)
            {
                _logger.LogInformation("Fetched {Count} users successfully",
                    (result.Data as IEnumerable<object>)?.Count() ?? 0);
                return Ok(result);
            }
            else
            {
                _logger.LogError("Failed to fetch users. Reason: {Message}", result.Message);
                return BadRequest(result);
            }
        }
    }
}
