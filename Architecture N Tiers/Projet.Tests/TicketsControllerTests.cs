using API.Controllers;
using API.Dtos;
using API.Dtos.Ticket;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projet.Entities;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

public class TicketsControllerTests
{
    [Fact]
    public async Task CreateTicket_ShouldCreateTicket()
    {
        var context = TestDbContextFactory.Create();
        var env = new FakeWebHostEnvironment();
        var controller = new TicketsController(context, env);

        var dto = new TicketCreateDto
        {
            Titre = "Nouveau ticket",
            Description = "Test création",
            StatutId = 1,
            PrioriteId = 1,
            CreateurId = 1,
            TechnicienId = 2,
            Fichier = null  // Pas de fichier → FichierUrl nullable
        };

        var result = await controller.CreateTicket(dto);

        Assert.Equal(1, context.Tickets.Count());
    }

    [Fact]
    public async Task ChangeStatut_ToCloture_ShouldSetDateCloture()
    {
        var context = TestDbContextFactory.Create();
        var env = new FakeWebHostEnvironment();
        var controller = new TicketsController(context, env);

        var ticket = new Ticket
        {
            Id = 1,
            Titre = "Bug réseau",
            Description = "Connexion instable",
            StatutId = 1,
            PrioriteId = 1,
            CreateurId = 1,
            TechnicienId = 2
        };

        context.Tickets.Add(ticket);
        context.SaveChanges();

        var dto = new ChangeStatutDto { StatutId = 4 }; // Clôturé

        var result = await controller.ChangeStatut(1, dto);

        var updatedTicket = context.Tickets.First();
        Assert.NotNull(updatedTicket.DateCloture);
    }

    [Fact]
    public async Task ChangeStatut_InvalidStatut_ShouldReturnBadRequest()
    {
        var context = TestDbContextFactory.Create();
        var env = new FakeWebHostEnvironment();
        var controller = new TicketsController(context, env);

        context.Tickets.Add(new Ticket
        {
            Id = 1,
            Titre = "Test",
            Description = "Test",
            StatutId = 1,
            PrioriteId = 1,
            CreateurId = 1
        });

        context.SaveChanges();

        var dto = new ChangeStatutDto { StatutId = 999 };

        var result = await controller.ChangeStatut(1, dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }
}
