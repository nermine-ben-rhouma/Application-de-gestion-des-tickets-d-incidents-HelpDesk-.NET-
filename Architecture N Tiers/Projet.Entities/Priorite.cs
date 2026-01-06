using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet.Entities
{
    public class Priorite
    {
        public int Id { get; set; }
        public string NomPriorite { get; set; }

        public ICollection<Ticket> Tickets { get; set; }
    }
}
