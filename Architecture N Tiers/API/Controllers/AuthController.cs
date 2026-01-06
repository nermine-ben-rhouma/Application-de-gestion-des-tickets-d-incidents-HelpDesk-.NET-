using API.Dtos;
using API.Dtos.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;
using Projet.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly JwtService _jwtService;

        public AuthController(DataContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || user.MotDePasse != dto.Password)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            var token = _jwtService.GenerateToken(user.Id, user.Role);

            // Normalisation du rôle pour le front
            string roleNormalized = user.Role.NomRole.ToLower().Trim();
            if (roleNormalized == "administrateur") roleNormalized = "admin";
            if (roleNormalized == "employé") roleNormalized = "employe";
            if (roleNormalized == "technicien") roleNormalized = "technicien";

            return Ok(new
            {
                token = token,
                user = new
                {
                    user.Id,
                    user.Nom,
                    user.Prenom,
                    user.Email,
                    role = roleNormalized
                }
            });
        }
    }
}
