using API.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        // GET api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserReadDto
                {
                    Id = u.Id,
                    Nom = u.Nom,
                    Prenom = u.Prenom,
                    Email = u.Email,
                    Role = u.Role.NomRole
                })
                .ToListAsync();

            return Ok(users);
        }

        // POST api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreateDto dto)
        {
            var role = await _context.Roles.FindAsync(dto.RoleId);
            if (role == null)
                return BadRequest("Role invalide");

            var user = new User
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                MotDePasse = dto.MotDePasse,
                RoleId = dto.RoleId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Utilisateur créé");
        }

        // PUT api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Utilisateur introuvable");

            // Vérification du rôle
            var role = await _context.Roles.FindAsync(dto.RoleId);
            if (role == null)
                return BadRequest("Role invalide");

            // Mise à jour des champs
            user.Nom = dto.Nom;
            user.Prenom = dto.Prenom;
            user.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.MotDePasse))
                user.MotDePasse = dto.MotDePasse; // pour le hash à l'avenir
            user.RoleId = dto.RoleId;

            await _context.SaveChangesAsync();
            return Ok("Utilisateur modifié");
        }

        // DELETE api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Utilisateur introuvable");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Utilisateur supprimé");
        }
    }
}
