namespace TaskManagementSystem.API.Middleware
{
    using System.Net;
    using System.Text.Json;
    using TaskManagementSystem.Service.Utility;

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
                _logger.LogError(ex, "Unhandled exception at {Path}", context.Request.Path);
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            string message = "An unexpected error occurred.";

            if (exception is KeyNotFoundException) statusCode = HttpStatusCode.NotFound;
            else if (exception is UnauthorizedAccessException) statusCode = HttpStatusCode.Unauthorized;
            else if (exception is ArgumentException) statusCode = HttpStatusCode.BadRequest;

            var response = new ApiResponse<object>(
                statusCode: (int)statusCode,
                success: false,
                message: exception.Message
            );

            var result = JsonSerializer.Serialize(response);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(result);
        }
    }
}
