using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models.Category;
using ToDoApp.Services.Interfaces;

namespace ToDoApp.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService ?? throw new ArgumentNullException(nameof(categoryService));
        }

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryModel model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _categoryService.CreateAsync(CurrentUserId, model, cancellationToken);
            return CreatedAtAction(nameof(GetMyCategories), result);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCategories(CancellationToken cancellationToken)
        {
            var result = await _categoryService.GetUserCategoriesAsync(CurrentUserId, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            await _categoryService.DeleteAsync(CurrentUserId, id, cancellationToken);
            return NoContent();
        }
    }
}
