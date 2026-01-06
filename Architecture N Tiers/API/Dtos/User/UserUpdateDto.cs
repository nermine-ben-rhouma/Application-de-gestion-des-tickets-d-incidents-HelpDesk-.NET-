namespace API.Dtos.User
{
    public class UserUpdateDto
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string? MotDePasse { get; set; } // Optionnel
        public int RoleId { get; set; }
    }
}
