using System.Data;

namespace Projet.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; }

        // ===== ROLE =====
        public int RoleId { get; set; }
        public Role Role { get; set; }

        // ===== NAVIGATIONS =====
        public ICollection<Ticket> TicketsCrees { get; set; } = new List<Ticket>();
        public ICollection<Ticket> TicketsAssignes { get; set; } = new List<Ticket>();
        public ICollection<Commentaire> Commentaires { get; set; } = new List<Commentaire>();
    }
}