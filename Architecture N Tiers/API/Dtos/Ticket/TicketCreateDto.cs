using Microsoft.AspNetCore.Http;

namespace API.Dtos.Ticket
{
    public class TicketCreateDto
    {
        public string Titre { get; set; }
        public string Description { get; set; }
        public int StatutId { get; set; }
        public int PrioriteId { get; set; }
        public int CreateurId { get; set; }
        public int? TechnicienId { get; set; }  // nullable

        public IFormFile Fichier { get; set; }  // Le fichier à uploader
    }
}
