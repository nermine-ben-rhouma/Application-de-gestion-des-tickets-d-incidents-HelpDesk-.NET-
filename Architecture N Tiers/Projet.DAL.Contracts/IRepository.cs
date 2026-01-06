using System.Linq.Expressions;

namespace Projet.DAL.Contracts
{
    public interface IRepository
    {
        void Submit();
    }

    public interface IRepository<T> : IRepository where T : class
    {
        T GetById(params object[] id);

        /// <summary>
        /// Return list of objects filtred by a predicate and including wanted properties 
        /// </summary>
        /// <param name="predicate"> filter to be applied</param>
        /// <param name="includeProperties">list of properties ti include</param>
        /// <returns>List of objects</returns>

        IEnumerable<T> GetMany(Expression<Func<T, bool>>? predicate = null, 
            params Expression<Func<T, object>>[] includeProperties);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);

    }
}