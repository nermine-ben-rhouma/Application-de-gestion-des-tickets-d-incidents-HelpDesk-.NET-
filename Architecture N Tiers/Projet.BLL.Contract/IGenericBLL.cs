using System.Linq.Expressions;

namespace Projet.BLL.Contract
{
    public interface IGenericBLL<T> where T : class, new()
    {
        void Add(T entity);
        void Delete(T entity);

        T GetById(params object[] id);

        IEnumerable<T> GetMany(Expression<Func<T, bool>>? predicate = null, params Expression<Func<T, object>>[] includeProperties);

        void Submit();

        void Update(T entity);

    }
}