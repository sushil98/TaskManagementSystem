using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.DataAccess.DTO
{
    public class User : IdentityUser<Guid>
    {
        [Key]
        public int ID { get; set; }
        public ICollection<TaskManager> AssignedTasks { get; set; } = new List<TaskManager>();
        public ICollection<TaskManager> CreatedTasks { get; set; } = new List<TaskManager>();
    }
}
