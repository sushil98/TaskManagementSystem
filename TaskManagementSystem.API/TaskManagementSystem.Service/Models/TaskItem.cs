using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.Service.Models
{
    public class TaskItem
    {
        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required, StringLength(20)]
        public string Status { get; set; } = Common.TaskStatus.Pending;

        [Required, StringLength(20)]
        public string Priority { get; set; } = Common.TaskPriority.Medium;

        [Required]
        public string Email { get; set; }

        [Required]
        public Guid AssigneeID { get; set; }
    }
}
