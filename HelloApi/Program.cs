using HelloApi.Application;
using HelloApi.Domain.Interfaces;
using HelloApi.Endpoints;
using HelloApi.Infrastructure.Repositories;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://zany-funicular-7v9prvrrpg62x5p9-4200.app.github.dev")
              .SetIsOriginAllowed(origin => true) // Permite qualquer origem de forma dinâmica
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // cuidado: exige origem explícita
    });
});
var connectionString = builder.Configuration.GetConnectionString("Default")!;
builder.Services.AddScoped<NpgsqlConnection>(_ => new NpgsqlConnection(connectionString));
builder.Services.AddScoped<IMugRepository, MugRepository>();
builder.Services.AddScoped<MugService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapGet("/hello", () => "Hello World!");

app.MapMugEndpoints();

app.MapGet("/people", async (NpgsqlConnection db) =>
{
    await db.OpenAsync();
    await using var cmd = new NpgsqlCommand("SELECT name FROM people", db);
    var people = new List<string>();
    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        people.Add(reader.GetString(0));
    }
    return Results.Json(people);
});

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
