using Dapper;
using HelloApi.Domain.Entities;
using HelloApi.Domain.Interfaces;
using Npgsql;

namespace HelloApi.Infrastructure.Repositories
{
    public class MugRepository : IMugRepository
    {
        private readonly NpgsqlConnection _connection;

        public MugRepository(NpgsqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Mug>> GetAllAsync()
        {
            await _connection.OpenAsync();
            var mugs = await _connection.QueryAsync<Mug>("SELECT id, name, description, stock FROM mugs");
            await _connection.CloseAsync();
            return mugs;
        }

        public async Task<Mug?> GetByIdAsync(int id)
        {
            await _connection.OpenAsync();
            var mug = await _connection.QuerySingleOrDefaultAsync<Mug>(
                "SELECT id, name, description, stock FROM mugs WHERE id = @id",
                new { id });
            await _connection.CloseAsync();
            return mug;
        }

        public async Task<int> CreateAsync(Mug mug)
        {
            await _connection.OpenAsync();
            var sql = "INSERT INTO mugs (name, description, stock) VALUES (@Name, @Description, @Stock) RETURNING id";
            var id = await _connection.ExecuteScalarAsync<int>(sql, mug);
            await _connection.CloseAsync();
            return id;
        }

        public async Task UpdateAsync(Mug mug)
        {
            await _connection.OpenAsync();
            var sql = "UPDATE mugs SET name = @Name, description = @Description, stock = @Stock WHERE id = @Id";
            await _connection.ExecuteAsync(sql, mug);
            await _connection.CloseAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _connection.OpenAsync();
            var sql = "DELETE FROM mugs WHERE id = @id";
            await _connection.ExecuteAsync(sql, new { id });
            await _connection.CloseAsync();
        }
    }
}
