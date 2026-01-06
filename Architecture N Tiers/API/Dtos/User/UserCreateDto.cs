using Projet.Services;

    namespace API.Dtos.User

{
    public class UserCreateDto
    {
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string MotDePasse { get; set; } = null!;
        public int RoleId { get; set; }
    }
}
