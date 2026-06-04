using System;

namespace ToDoApp.Services.Exceptions
{
    public abstract class AppException : Exception
    {
        public int StatusCode { get; }

        protected AppException(string message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(message, 404)
        {
        }
    }

    public class BadRequestException : AppException
    {
        public BadRequestException(string message) : base(message, 400)
        {
        }
    }

    public class UnauthorizedException : AppException
    {
        public UnauthorizedException(string message) : base(message, 401)
        {
        }
    }
}
