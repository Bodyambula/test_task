using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Models.Category;

namespace ToDoApp.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDto> CreateAsync(int userId, CreateCategoryModel model, CancellationToken cancellationToken = default);

        Task<IEnumerable<CategoryDto>> GetUserCategoriesAsync(int userId, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int userId, int categoryId, CancellationToken cancellationToken = default);
    }
}
