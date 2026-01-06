using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Projet.Entities
{
    public class Statut
    {
        public int Id { get; set; }
        public string NomStatut { get; set; }

        [JsonIgnore]
        public ICollection<Ticket> Tickets { get; set; }
    }
}