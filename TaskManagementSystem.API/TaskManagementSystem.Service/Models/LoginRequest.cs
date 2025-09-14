using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.Service.Models
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 15 characters.")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 20 characters.")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
    }
}
