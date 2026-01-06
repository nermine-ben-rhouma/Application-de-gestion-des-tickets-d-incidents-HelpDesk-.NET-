namespace API.Dtos.Commentaire
{
    public class CommentaireCreateDto
    {
        public string Contenu { get; set; } = null!;
        public int TicketId { get; set; }
        public int UserId { get; set; }
    }
}
