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

// Global exception handler - error handling return JSON
app.Use(async (ctx, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        ctx.Response.StatusCode = 500;
        ctx.Response.ContentType = "application/json";
        var result = new { error = "An unexpected error occurred.", detail = ex.Message };
        await ctx.Response.WriteAsJsonAsync(result);
    }
});

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
    var errors = ValidateStudent(student, forUpdate: false);
    if (errors.Count > 0)
        return Results.BadRequest(new { errors });

    var id = await svc.CreateAsync(student);
    return Results.Created($"/api/students/{id}", new { Id = id });
}).WithName("CreateStudent");

app.MapPut("/api/students/{id:int}", async (int id, Student student, IStudentService svc) =>
{
    // Ensure the route id is used as the student's Id
    student.Id = id;
    var errors = ValidateStudent(student, forUpdate: true);
    if (errors.Count > 0)
        return Results.BadRequest(new { errors });

    var ok = await svc.UpdateAsync(student);
    return ok ? Results.NoContent() : Results.NotFound();
}).WithName("UpdateStudent");

// Validation helper -error msg
static Dictionary<string, string[]> ValidateStudent(Backend.Models.Student student, bool forUpdate)
{
    var errors = new Dictionary<string, string[]>();
    var list = new List<string>();

    if (string.IsNullOrWhiteSpace(student.FirstName))
        list.Add("FirstName is required.");
    if (string.IsNullOrWhiteSpace(student.LastName))
        list.Add("LastName is required.");

    if (!string.IsNullOrWhiteSpace(student.Email))
    {
        try
        {
            var _ = new System.Net.Mail.MailAddress(student.Email);
        }
        catch
        {
            list.Add("Email is not a valid email address.");
        }
    }

    if (student.DateOfBirth.HasValue)
    {
        var dob = student.DateOfBirth.Value;
        if (dob > DateTime.UtcNow)
            list.Add("DateOfBirth cannot be in the future.");
        var age = DateTime.UtcNow.Year - dob.Year;
        if (age > 150)
            list.Add("DateOfBirth looks invalid.");
    }

    if (list.Count > 0)
        errors["validationErrors"] = list.ToArray();

    return errors;
}

app.MapDelete("/api/students/{id:int}", async (int id, IStudentService svc) =>
{
    var ok = await svc.DeleteAsync(id);
    return ok ? Results.NoContent() : Results.NotFound();
}).WithName("DeleteStudent");

app.Run();
