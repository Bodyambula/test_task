using System;

namespace ToDoApp.Services.Exceptions
{
    public abstract class AppException : Exception
    {
        protected AppException(string message, int statusCode)
            : base(message)
        {
            StatusCode = statusCode;
        }

        public int StatusCode { get; }
    }
}
