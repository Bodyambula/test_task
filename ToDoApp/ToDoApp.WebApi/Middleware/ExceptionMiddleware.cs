using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ToDoApp.Services.Exceptions;

namespace ToDoApp.WebApi.Middleware
{
    // Global middleware to intercept unhandled exceptions and return standardized JSON error responses.
    // WARNING: Do not leak sensitive system details or stack traces to clients in production.
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = StatusCodes.Status500InternalServerError;
            var message = "An unexpected error occurred. Please try again later.";

            if (exception is AppException appException)
            {
                statusCode = appException.StatusCode;
                message = appException.Message;
            }
            else
            {
                _logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);
            }

            context.Response.StatusCode = statusCode;

            var response = new { error = message };
            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}
