using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.Service.Models
{
    public class Registration
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email format.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 20 characters.")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Confirm Password is required.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password and Confirm Password must match.")]
        public string? ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 15 characters.")]
        public string? Username { get; set; }
    }
}
