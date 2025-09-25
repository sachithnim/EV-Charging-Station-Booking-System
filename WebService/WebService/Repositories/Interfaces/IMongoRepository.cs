namespace WebService.Repositories.Interfaces
{
    public interface IMongoRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(string  id);
        Task CreateAsync(T entity);
        Task UpdateAsync(string id,T entity);
        Task DeleteAsync(string id);

        Task<List<T>> FindAsync(System.Linq.Expressions.Expression<Func<T, bool>> filter);
    }
}
