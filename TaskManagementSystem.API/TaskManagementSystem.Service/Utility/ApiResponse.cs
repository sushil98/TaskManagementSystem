namespace TaskManagementSystem.Service.Utility
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }

        public ApiResponse(int statusCode, bool success = true, string message = null, T data = default(T)) : this(statusCode)
        {
            Success = success;
            Data = data;
            Message = message;
            StatusCode = statusCode;
        }

        public ApiResponse(T data = default(T), string message = null) : this(200)
        {
            Success = true;
            Data = data;
            Message = message;

        }
        public ApiResponse(int statusCode)
        {
            StatusCode = statusCode;
        }
    }
}
