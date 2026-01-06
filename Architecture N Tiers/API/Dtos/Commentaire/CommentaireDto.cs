namespace API.Dtos.Commentaire
{
    public class CommentaireDto
    {
        public int Id { get; set; }
        public string Contenu { get; set; } = null!;
        public DateTime DateCreation { get; set; }
        public string Auteur { get; set; } = null!;
    }
}
