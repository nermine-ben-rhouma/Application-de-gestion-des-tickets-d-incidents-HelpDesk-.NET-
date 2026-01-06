using Projet.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet.Services.Interfaces
{
    public interface IUserService
    {
        IEnumerable<User> GetUsers();
    }
}