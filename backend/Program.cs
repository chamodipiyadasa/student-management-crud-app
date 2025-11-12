using Backend.Repositories;
using Backend.Services;
using Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IStudentService, StudentService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

app.MapGet("/api/students", async (IStudentService svc) =>
{
    var list = await svc.GetAllAsync();
    return Results.Ok(list);
}).WithName("GetStudents");

app.MapGet("/api/students/{id:int}", async (int id, IStudentService svc) =>
{
    var student = await svc.GetByIdAsync(id);
    return student is null ? Results.NotFound() : Results.Ok(student);
}).WithName("GetStudentById");

app.MapPost("/api/students", async (Student student, IStudentService svc) =>
{
    if (string.IsNullOrWhiteSpace(student.FirstName) || string.IsNullOrWhiteSpace(student.LastName))
        return Results.BadRequest("FirstName and LastName are required.");

    var id = await svc.CreateAsync(student);
    return Results.Created($"/api/students/{id}", new { Id = id });
}).WithName("CreateStudent");

app.MapPut("/api/students/{id:int}", async (int id, Student student, IStudentService svc) =>
{
    // Ensure the route id is used as the student's Id
    student.Id = id;
    var ok = await svc.UpdateAsync(student);
    return ok ? Results.NoContent() : Results.NotFound();
}).WithName("UpdateStudent");

app.MapDelete("/api/students/{id:int}", async (int id, IStudentService svc) =>
{
    var ok = await svc.DeleteAsync(id);
    return ok ? Results.NoContent() : Results.NotFound();
}).WithName("DeleteStudent");

app.Run();
