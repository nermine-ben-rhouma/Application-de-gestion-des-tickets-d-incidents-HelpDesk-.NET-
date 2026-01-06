using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projet.Entities
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }
        public DateTime DateCreation { get; set; } = DateTime.Now;
        public DateTime? DateCloture { get; set; }

        public int StatutId { get; set; }
        public Statut Statut { get; set; }

        public int PrioriteId { get; set; }
        public Priorite Priorite { get; set; }

        public int CreateurId { get; set; }
        [ForeignKey("CreateurId")]
        public User Createur { get; set; }

        public int? TechnicienId { get; set; }  // ← nullable
        [ForeignKey("TechnicienId")]
        public User Technicien { get; set; }

        public string FichierUrl { get; set; }
        public ICollection<Commentaire> Commentaires { get; set; } = new List<Commentaire>();
    }
}
