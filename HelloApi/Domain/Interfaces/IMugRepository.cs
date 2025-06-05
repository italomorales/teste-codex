using HelloApi.Domain.Entities;

namespace HelloApi.Domain.Interfaces
{
    public interface IMugRepository
    {
        Task<IEnumerable<Mug>> GetAllAsync();
        Task<Mug?> GetByIdAsync(int id);
        Task<int> CreateAsync(Mug mug);
        Task UpdateAsync(Mug mug);
        Task DeleteAsync(int id);
    }
}
