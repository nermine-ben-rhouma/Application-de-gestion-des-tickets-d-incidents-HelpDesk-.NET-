using API.Dtos;
using API.Dtos.Ticket;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;

        public TicketsController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // =========================
        // GET : tous les tickets
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Statut)
                .Include(t => t.Priorite)
                .Include(t => t.Createur)
                .Include(t => t.Technicien)
                .Select(t => new TicketReadDto
                {
                    Id = t.Id,
                    Titre = t.Titre,
                    Description = t.Description,
                    Statut = t.Statut.NomStatut,
                    Priorite = t.Priorite.NomPriorite,
                    Createur = t.Createur.Nom + " " + t.Createur.Prenom,
                    Technicien = t.Technicien != null
                        ? t.Technicien.Nom + " " + t.Technicien.Prenom
                        : null,
                    DateCreation = t.DateCreation,
                    DateCloture = t.DateCloture,
                    FichierUrl = t.FichierUrl
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // =========================
        // ✅ GET : ticket par ID
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Statut)
                .Include(t => t.Priorite)
                .Include(t => t.Createur)
                .Include(t => t.Technicien)
                .Where(t => t.Id == id)
                .Select(t => new TicketReadDto
                {
                    Id = t.Id,
                    Titre = t.Titre,
                    Description = t.Description,
                    Statut = t.Statut.NomStatut,
                    Priorite = t.Priorite.NomPriorite,
                    Createur = t.Createur.Nom + " " + t.Createur.Prenom,
                    Technicien = t.Technicien != null
                        ? t.Technicien.Nom + " " + t.Technicien.Prenom
                        : null,
                    DateCreation = t.DateCreation,
                    DateCloture = t.DateCloture,
                    FichierUrl = t.FichierUrl
                })
                .FirstOrDefaultAsync();

            if (ticket == null)
                return NotFound("Ticket introuvable");

            return Ok(ticket);
        }

        // =========================
        // POST : créer un ticket
        // =========================
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] TicketCreateDto dto)
        {       
            string fichierUrl = null;

            if (dto.Fichier != null)
            {
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Fichier.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Fichier.CopyToAsync(stream);

                fichierUrl = "/uploads/" + fileName;
            }

            var ticket = new Ticket
            {
                Titre = dto.Titre,
                Description = dto.Description,
                StatutId = dto.StatutId,
                PrioriteId = dto.PrioriteId,
                CreateurId = dto.CreateurId,
                TechnicienId = dto.TechnicienId,
                DateCreation = DateTime.Now,
                FichierUrl = fichierUrl
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(ticket);
        }

        // =========================
        // PUT : changer le statut
        // =========================
        [HttpPut("{id}/statut")]
        public async Task<IActionResult> ChangeStatut(int id, ChangeStatutDto dto)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Statut)
                .Include(t => t.Priorite)
                .Include(t => t.Createur)
                .Include(t => t.Technicien)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
                return NotFound("Ticket introuvable");

            var statut = await _context.Statuts.FirstOrDefaultAsync(s => s.Id == dto.StatutId);
            if (statut == null)
                return BadRequest("Statut invalide");

            ticket.StatutId = dto.StatutId;
            ticket.DateCloture =
                statut.NomStatut.ToLower() == "clôturé" ||
                statut.NomStatut.ToLower() == "clos"
                ? DateTime.Now
                : null;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE : supprimer
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound("Ticket introuvable");

            if (!string.IsNullOrEmpty(ticket.FichierUrl))
            {
                var filePath = Path.Combine(_env.ContentRootPath, ticket.FichierUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket supprimé avec succès" });
        }
    }
}
