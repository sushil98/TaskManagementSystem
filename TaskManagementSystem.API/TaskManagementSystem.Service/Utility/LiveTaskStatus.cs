using Microsoft.AspNetCore.SignalR;

namespace TaskManagementSystem.Service.Utility
{
    public class LiveTaskStatus : Hub
    {
        public async Task UpdateTaskStatus(Guid taskID, string status)
        {
            await Clients.All.SendAsync("ReceiveTaskUpdate", taskID, status);
        }
    }
}
