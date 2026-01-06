using API.Dtos.Commentaire;
using API.Dtos.Ticket;
using API.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;
using Projet.Services.Interfaces;
namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class CommentaireController : ControllerBase
    {
        private readonly DataContext _context;

        public CommentaireController(DataContext context)
        {
            _context = context;
        }


        [HttpPost]
        public async Task<IActionResult> Add(CommentaireCreateDto dto)
        {
            if (!await _context.Tickets.AnyAsync(t => t.Id == dto.TicketId))
                return BadRequest("Ticket inexistant");

            if (!await _context.Users.AnyAsync(u => u.Id == dto.UserId))
                return BadRequest("Utilisateur inexistant");

            var commentaire = new Commentaire
            {
                Contenu = dto.Contenu,
                TicketId = dto.TicketId,
                AuteurId = dto.UserId
            };

            _context.Commentaires.Add(commentaire);
            await _context.SaveChangesAsync();

            return Ok(commentaire);
        }

        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetByTicket(int ticketId)
        {
            var commentaires = await _context.Commentaires
                .Where(c => c.TicketId == ticketId)
                .Include(c => c.Auteur)
                .Select(c => new CommentaireDto
                {
                    Id = c.Id,
                    Contenu = c.Contenu,
                    DateCreation = c.DateCommentaire,
                    Auteur = c.Auteur.Nom
                })
                .ToListAsync();

            return Ok(commentaires);
        }
    }
}
    