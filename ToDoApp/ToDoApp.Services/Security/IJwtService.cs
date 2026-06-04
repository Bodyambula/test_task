using ToDoApp.Entities.Entities;

namespace ToDoApp.Services.Security
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
