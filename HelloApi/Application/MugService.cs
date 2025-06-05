using HelloApi.Domain.Entities;
using HelloApi.Domain.Interfaces;

namespace HelloApi.Application
{
    public class MugService
    {
        private readonly IMugRepository _repository;

        public MugService(IMugRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Mug>> GetAllAsync() => _repository.GetAllAsync();

        public Task<Mug?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task<int> CreateAsync(Mug mug) => _repository.CreateAsync(mug);

        public Task UpdateAsync(Mug mug) => _repository.UpdateAsync(mug);

        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
