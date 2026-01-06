using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Projet.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string NomRole { get; set; }

        // Navigation
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
