using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManagementSystem.DataAccess.DTO;
using TaskManagementSystem.Service.Interface;
using TaskManagementSystem.Service.Models;
using TaskManagementSystem.Service.Utility;

namespace TaskManagementSystem.Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserService> _logger;

        public UserService(UserManager<User> userManager, IConfiguration configuration, ILogger<UserService> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<User> FindByNameAsync(string username)
        {
            _logger.LogInformation("Looking up user by username: {Username}", username);
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                _logger.LogWarning("No user found with username: {Username}", username);
            else
                _logger.LogInformation("User found: {Username}", username);

            return user;
        }

        public async Task<IdentityResult> CreateUserAsync(User user, string password)
        {
            _logger.LogInformation("Creating user with email: {Email}", user.Email);
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
                _logger.LogInformation("User created successfully: {Email}", user.Email);
            else
                _logger.LogError($"Failed to create user {user.Email}",
                    user.Email, string.Join(", ", result.Errors.Select(e => e.Description)));

            return result;
        }

        public async Task<ApiResponse<IdentityResult>> Register(Registration registration)
        {
            _logger.LogInformation("Attempting registration for email: {Email}", registration.Email);

            var userExists = await FindByNameAsync(registration.Username);
            if (userExists != null)
            {
                _logger.LogWarning("Registration failed: User {Username} already exists", registration.Username);
                return new ApiResponse<IdentityResult>(
                    StatusCodes.Status500InternalServerError, false, "User already exists!");
            }

            User user = new()
            {
                Email = registration.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registration.Username
            };

            var result = await _userManager.CreateAsync(user, registration.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                _logger.LogInformation("User registered successfully: {Email}", registration.Email);
                return new ApiResponse<IdentityResult>(result, "User registered successfully");
            }

            _logger.LogError($"Registration failed for {registration.Email}.",
                registration.Email, string.Join(", ", result.Errors.Select(e => e.Description)));

            return new ApiResponse<IdentityResult>(
                StatusCodes.Status400BadRequest, false, "Registration failed");
        }

        public async Task<ApiResponse<LoginResponse>> Login(LoginRequest login)
        {
            _logger.LogInformation("Login attempt for username: {Username}", login.Username);

            var user = await _userManager.FindByNameAsync(login.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = GetToken(authClaims);

                var response = new LoginResponse()
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Email = user.Email,
                    Expiration = token.ValidTo
                };

                _logger.LogInformation("Login successful for user: {Username}", login.Username);
                return new ApiResponse<LoginResponse>(response, "Login successful");
            }

            _logger.LogWarning("Login failed for username: {Username}", login.Username);
            return new ApiResponse<LoginResponse>(
                StatusCodes.Status401Unauthorized, false, "Login failed!");
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            _logger.LogDebug("Generating JWT token with {ClaimsCount} claims", authClaims.Count);

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            _logger.LogDebug("JWT token generated. Expires at {Expiration}", token.ValidTo);
            return token;
        }

        public async Task<ApiResponse<dynamic>> GetAllUsers()
        {
            _logger.LogInformation("Fetching all users");

            var users = await _userManager.Users.Select(x => new
            {
                Email = x.Email,
                UserName = x.UserName,
                ID = x.Id
            }).ToListAsync();

            _logger.LogInformation("Fetched {Count} users", users.Count);

            return new ApiResponse<dynamic>(users, "Users fetched successfully");
        }
    }
}
