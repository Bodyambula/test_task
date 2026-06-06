using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Models.Task;

namespace ToDoApp.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateAsync(int userId, CreateTaskModel model, CancellationToken cancellationToken = default);

        Task<TaskDto?> GetByIdAsync(int userId, int taskId, CancellationToken cancellationToken = default);

        Task<TaskPagedResultDto> GetPagedAsync(int userId, int page, int pageSize, bool? isCompleted, int? categoryId, string? search, CancellationToken cancellationToken = default);

        Task<TaskDto?> UpdateAsync(int userId, int taskId, UpdateTaskModel model, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int userId, int taskId, CancellationToken cancellationToken = default);
    }
}
