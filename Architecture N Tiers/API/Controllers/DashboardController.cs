using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DataContext _context;

        public DashboardController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalTickets = await _context.Tickets.CountAsync();
            var resolvedTickets = await _context.Tickets
                .Include(t => t.Statut)
                .CountAsync(t => t.Statut.NomStatut.ToLower() == "clôturé" || t.Statut.NomStatut.ToLower() == "clos");

            var pendingTickets = totalTickets - resolvedTickets;
            var resolutionRate = totalTickets > 0 ? (resolvedTickets * 100 / totalTickets) : 0;

            // Temps moyen de résolution
            var resolvedList = await _context.Tickets
                .Include(t => t.Statut)
                .Where(t => t.DateCloture != null)
                .ToListAsync();

            var avgResolutionTime = resolvedList.Count > 0
                ? TimeSpan.FromMinutes(resolvedList.Average(t => (t.DateCloture.Value - t.DateCreation).TotalMinutes))
                : TimeSpan.Zero;
            // Techniciens actifs (uniques ayant au moins un ticket assigné)
            var activeTechnicians = await _context.Tickets
                .Where(t => t.TechnicienId != null)  // seulement tickets avec technicien assigné
                .Select(t => t.TechnicienId)         // prendre les IDs des techniciens
                .Distinct()                          // éliminer les doublons
                .CountAsync();                       // compter le nombre unique


            return Ok(new
            {
                totalTickets,
                resolutionRate,
                avgResolutionTime = $"{Math.Round(avgResolutionTime.TotalHours, 1)}h",
                pendingTickets ,
                 activeTechnicians
            });
        }

        // GET: api/Dashboard/daily
        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyTickets()
        {
            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.Today.AddDays(-i))
                .OrderBy(d => d)
                .ToList();

            var dailyTickets = await _context.Tickets
                .Where(t => last7Days.Contains(t.DateCreation.Date))
                .GroupBy(t => t.DateCreation.Date)
                .Select(g => new { day = g.Key.DayOfWeek.ToString().Substring(0, 3), count = g.Count() })
                .ToListAsync();

            // Remplir les jours sans tickets
            var result = last7Days.Select(d =>
            {
                var dayData = dailyTickets.FirstOrDefault(dt => dt.day == d.DayOfWeek.ToString().Substring(0, 3));
                return new { day = d.DayOfWeek.ToString().Substring(0, 3), count = dayData?.count ?? 0 };
            }).ToList();

            return Ok(result);
        }
    }
}
