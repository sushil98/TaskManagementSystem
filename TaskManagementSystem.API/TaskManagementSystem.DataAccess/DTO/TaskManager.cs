using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagementSystem.Common;
using Common = TaskManagementSystem.Common;

namespace TaskManagementSystem.DataAccess.DTO
{
    public class TaskManager : CommonEntityProperties
    {
        [Key]
        public Guid ID { get; set; }

        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required, StringLength(20)]
        public string Status { get; set; } = Common.TaskStatus.Pending; // e.g., Pending, InProgress, Done

        [Required, StringLength(20)]
        public string Priority { get; set; } = Common.TaskPriority.Medium; // e.g., Low, Medium, High
    }
}
