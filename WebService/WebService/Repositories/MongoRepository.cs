

using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WebService.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Expressions;
using MongoDB.Bson;

namespace WebService.Repositories
{
    public class MongoRepository<T> : IMongoRepository<T> where T : class
    {
        private readonly IMongoCollection<T> _collection;

        public MongoRepository(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<T>(typeof(T).Name.ToLower() + "s"); 
        }

        // Get all entities
        public async Task<List<T>> GetAllAsync() => await _collection.Find(_ => true).ToListAsync();

        // Get by ID
        public async Task<T> GetByIdAsync(string id)
        {
            FilterDefinition<T> filter;

            if (ObjectId.TryParse(id, out var objectId))
            {
                filter = Builders<T>.Filter.Eq("_id", objectId);
            }
            else
            {
                filter = Builders<T>.Filter.Eq("_id", id);
            }

            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        // Create entity
        public async Task CreateAsync(T entity) => await _collection.InsertOneAsync(entity);

        // Update entity
        public async Task UpdateAsync(string id, T entity)
        {
            FilterDefinition<T> filter;

            if (ObjectId.TryParse(id, out var objectId))
            {
                filter = Builders<T>.Filter.Eq("_id", objectId);
            }
            else
            {
                filter = Builders<T>.Filter.Eq("_id", id);
            }

            await _collection.ReplaceOneAsync(filter, entity);
        }

        // Delete entity
        public async Task DeleteAsync(string id)
        {
            FilterDefinition<T> filter;

            if (ObjectId.TryParse(id, out var objectId))
            {
                filter = Builders<T>.Filter.Eq("_id", objectId);
            }
            else
            {
                filter = Builders<T>.Filter.Eq("_id", id);
            }

            await _collection.DeleteOneAsync(filter);
        }

        // Find with filter
        public async Task<List<T>> FindAsync(Expression<Func<T, bool>> filter) => await _collection.Find(filter).ToListAsync();
    }
}

public class MongoDBSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}