using Projet.DAL.Contracts;
using Projet.Entities;

namespace Projet.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly Dictionary<Type, IRepository> _repositories;

        public UnitOfWork(IRepository<User> userRepo)
        {
            _repositories = _repositories ?? new Dictionary<Type, IRepository>();
            _repositories.Add(typeof(User), userRepo);
           


        }
        public IRepository GetRepository<T>() where T : class
        {
            return _repositories[typeof(T)];
        }
    }
}