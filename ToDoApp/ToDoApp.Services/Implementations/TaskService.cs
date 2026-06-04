using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;
using ToDoApp.Models.Task;
using ToDoApp.Services.Exceptions;
using ToDoApp.Services.Extensions;
using ToDoApp.Services.Interfaces;

namespace ToDoApp.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TaskService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<TaskDto> CreateAsync(int userId, CreateTaskModel model, CancellationToken cancellationToken = default)
        {
            if (model == null)
                throw new BadRequestException("Task details cannot be null.");

            // Verify user exists
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found.");

            // Verify category belongs to user
            if (model.CategoryId.HasValue)
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(model.CategoryId.Value, cancellationToken);
                if (category == null || category.UserId != userId)
                    throw new BadRequestException("Invalid CategoryId. The category does not exist or does not belong to you.");
            }

            var task = new TaskItem
            {
                Title = model.Title,
                Description = model.Description,
                DueDate = model.DueDate,
                CategoryId = model.CategoryId,
                UserId = userId,
                IsCompleted = false
            };

            await _unitOfWork.Tasks.AddAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Fetch again to include Category if set
            if (task.CategoryId.HasValue)
            {
                task.Category = await _unitOfWork.Categories.GetByIdAsync(task.CategoryId.Value, cancellationToken);
            }

            return task.ToDto();
        }

        public async Task<TaskDto?> GetByIdAsync(int userId, int taskId, CancellationToken cancellationToken = default)
        {
            var task = await _unitOfWork.Tasks.GetByIdAsync(taskId, cancellationToken);
            if (task == null || task.UserId != userId)
                throw new NotFoundException($"Task with ID {taskId} not found.");

            // Fetch category
            if (task.CategoryId.HasValue)
            {
                task.Category = await _unitOfWork.Categories.GetByIdAsync(task.CategoryId.Value, cancellationToken);
            }

            return task.ToDto();
        }

        public async Task<TaskPagedResultDto> GetPagedAsync(
            int userId, 
            int page, 
            int pageSize, 
            bool? isCompleted, 
            int? categoryId, 
            CancellationToken cancellationToken = default)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Limit page size to prevent abuse

            // Verify category if requested
            if (categoryId.HasValue)
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(categoryId.Value, cancellationToken);
                if (category == null || category.UserId != userId)
                    throw new BadRequestException("Invalid CategoryId filter.");
            }

            var (items, totalCount) = await _unitOfWork.Tasks.GetPagedAsync(
                userId, page, pageSize, isCompleted, categoryId, cancellationToken);

            return new TaskPagedResultDto
            {
                Items = items.Select(t => t.ToDto()),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<TaskDto?> UpdateAsync(int userId, int taskId, UpdateTaskModel model, CancellationToken cancellationToken = default)
        {
            if (model == null)
                throw new BadRequestException("Task details cannot be null.");

            var task = await _unitOfWork.Tasks.GetByIdAsync(taskId, cancellationToken);
            if (task == null || task.UserId != userId)
                throw new NotFoundException($"Task with ID {taskId} not found.");

            // Verify new category belongs to user
            if (model.CategoryId.HasValue && model.CategoryId != task.CategoryId)
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(model.CategoryId.Value, cancellationToken);
                if (category == null || category.UserId != userId)
                    throw new BadRequestException("Invalid CategoryId.");
            }

            task.Title = model.Title;
            task.Description = model.Description;
            task.IsCompleted = model.IsCompleted;
            task.DueDate = model.DueDate;
            task.CategoryId = model.CategoryId;
            task.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Tasks.Update(task);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Fetch category
            if (task.CategoryId.HasValue)
            {
                task.Category = await _unitOfWork.Categories.GetByIdAsync(task.CategoryId.Value, cancellationToken);
            }
            else
            {
                task.Category = null;
            }

            return task.ToDto();
        }

        public async Task<bool> DeleteAsync(int userId, int taskId, CancellationToken cancellationToken = default)
        {
            var task = await _unitOfWork.Tasks.GetByIdAsync(taskId, cancellationToken);
            if (task == null || task.UserId != userId)
                throw new NotFoundException($"Task with ID {taskId} not found.");

            _unitOfWork.Tasks.Delete(task);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
