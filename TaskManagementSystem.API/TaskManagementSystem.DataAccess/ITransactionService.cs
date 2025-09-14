
namespace TaskManagementSystem.DataAccess
{
    public interface ITransactionService
    {
        Task ExecuteAsync(Func<Task> action);
    }
}
