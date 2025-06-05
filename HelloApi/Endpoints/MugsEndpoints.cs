using HelloApi.Application;
using HelloApi.Domain.Entities;

namespace HelloApi.Endpoints
{
    public static class MugsEndpoints
    {
        public static void MapMugEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/mugs");

            group.MapGet("/", async (MugService service) => Results.Ok(await service.GetAllAsync()));

            group.MapGet("/{id:int}", async (int id, MugService service) =>
            {
                var mug = await service.GetByIdAsync(id);
                return mug is not null ? Results.Ok(mug) : Results.NotFound();
            });

            group.MapPost("/", async (Mug mug, MugService service) =>
            {
                var id = await service.CreateAsync(mug);
                return Results.Created($"/mugs/{id}", new { id });
            });

            group.MapPut("/{id:int}", async (int id, Mug mug, MugService service) =>
            {
                var existing = await service.GetByIdAsync(id);
                if (existing is null) return Results.NotFound();
                mug.Id = id;
                await service.UpdateAsync(mug);
                return Results.NoContent();
            });

            group.MapDelete("/{id:int}", async (int id, MugService service) =>
            {
                var existing = await service.GetByIdAsync(id);
                if (existing is null) return Results.NotFound();
                await service.DeleteAsync(id);
                return Results.NoContent();
            });
        }
    }
}
