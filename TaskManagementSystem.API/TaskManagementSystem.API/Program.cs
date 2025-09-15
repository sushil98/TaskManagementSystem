using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using TaskManagementSystem.API.Middleware;
using TaskManagementSystem.DataAccess;
using TaskManagementSystem.DataAccess.DTO;
using TaskManagementSystem.Service;
using TaskManagementSystem.Service.Interface;
using TaskManagementSystem.Service.Utility;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("TaskManagementSystem")));

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITaskManagerService, TaskManagerService>();
builder.Services.AddScoped<ITaskManagerService, TaskManagerService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList();

        var response = new ApiResponse<object>(
            statusCode: 400,
            success: false,
            message: "Validation failed",
            data: errors
        );

        return new BadRequestObjectResult(response);
    };
});

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("corsapp", builder =>
    {
        builder
            .SetIsOriginAllowed(origin =>
            {
                var uri = new Uri(origin);
                return uri.Host == "localhost"; // allows any localhost port
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // if using cookies or auth headers
    });
});

builder.Services.AddSignalR();

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();
app.UseSerilogRequestLogging();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseRouting();
app.UseCors("corsapp");
app.MapHub<LiveTaskStatus>("/liveTaskStatus");
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();