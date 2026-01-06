using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet.Entities
{
    public class Commentaire
    {
        public int Id { get; set; }

        public string Contenu { get; set; }
        public DateTime DateCommentaire { get; set; } = DateTime.Now;

        // ===== TICKET =====
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; }

        // ===== AUTEUR =====
        public int AuteurId { get; set; }
        public User Auteur { get; set; }
    }
}
