namespace API.Dtos.Ticket
{
    public class TicketReadDto
    {
        public int Id { get; set; }
        public string Titre { get; set; }
        public string Description { get; set; }

        public string Statut { get; set; }
        public string Priorite { get; set; }

        public string Createur { get; set; }
        public string? Technicien { get; set; }  // nullable

        public DateTime DateCreation { get; set; }
        public DateTime? DateCloture { get; set; }

        public string FichierUrl { get; set; }
    }
}
