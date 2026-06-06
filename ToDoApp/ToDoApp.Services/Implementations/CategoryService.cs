using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;
using ToDoApp.Models.Category;
using ToDoApp.Services.Exceptions;
using ToDoApp.Services.Extensions;
using ToDoApp.Services.Interfaces;

namespace ToDoApp.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<CategoryDto> CreateAsync(int userId, CreateCategoryModel model, CancellationToken cancellationToken = default)
        {
            if (model == null)
                throw new BadRequestException("Category details cannot be null.");

            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found.");

            var existingCategories = await _unitOfWork.Categories.GetByUserIdAsync(userId, cancellationToken);
            if (existingCategories.Any(c => c.Name.Equals(model.Name, StringComparison.OrdinalIgnoreCase)))
                throw new BadRequestException($"Category with name '{model.Name}' already exists.");

            var category = new Category
            {
                Name = model.Name,
                UserId = userId
            };

            await _unitOfWork.Categories.AddAsync(category, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return category.ToDto();
        }

        public async Task<IEnumerable<CategoryDto>> GetUserCategoriesAsync(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found.");

            var categories = await _unitOfWork.Categories.GetByUserIdAsync(userId, cancellationToken);
            return categories.Select(c => c.ToDto());
        }

        public async Task<bool> DeleteAsync(int userId, int categoryId, CancellationToken cancellationToken = default)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId, cancellationToken);

            if (category == null || category.UserId != userId)
                throw new NotFoundException($"Category with ID {categoryId} not found for this user.");

            _unitOfWork.Categories.Delete(category);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
