using Projet.BLL.Contract;
using Projet.Entities;
using Projet.Services.Interfaces;

namespace Projet.Services
{
    public class UserService : IUserService
    {
        private IGenericBLL<User> _userBLL;
        public UserService(IGenericBLL<User> userBll)
        {
            _userBLL = userBll;
        }
        public IEnumerable<User> GetUsers()
        {
            return _userBLL.GetMany();

        }
    }
}