using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Models.User;

namespace ToDoApp.Services.Interfaces
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterModel model, CancellationToken cancellationToken = default);

        Task<AuthResponseDto> LoginAsync(LoginModel model, CancellationToken cancellationToken = default);
    }
}
