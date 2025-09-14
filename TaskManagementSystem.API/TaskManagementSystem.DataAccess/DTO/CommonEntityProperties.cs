using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagementSystem.DataAccess.DTO
{
    public class CommonEntityProperties
    {
        public Guid AssigneeID { get; set; }
        public Guid CreatorID { get; set; }

        [ForeignKey(nameof(AssigneeID))]
        public User? Assignee { get; set; }

        [ForeignKey(nameof(CreatorID))]
        public User? Creator { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}
