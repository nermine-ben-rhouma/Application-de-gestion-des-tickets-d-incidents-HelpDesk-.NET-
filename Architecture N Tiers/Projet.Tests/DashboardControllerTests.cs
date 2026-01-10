using Xunit;
using Microsoft.AspNetCore.Mvc;
using Projet.Entities;
using API.Controllers;
using System.Threading.Tasks;
using System.Linq;
using System;
using Projet.Context;
using Newtonsoft.Json.Linq;

public class DashboardControllerTests
{
    // Réutilisation de la factory existante pour DB InMemory
    private DataContext GetInMemoryContext()
    {
        var context = TestDbContextFactory.Create();

        // Seed tickets pour Dashboard
        var now = DateTime.Now;
        context.Tickets.AddRange(
            new Ticket
            {
                Id = 1,
                Titre = "Ticket 1",
                Description = "Desc",
                StatutId = 1, // Nouveau
                PrioriteId = 1,
                CreateurId = 1,
                TechnicienId = 2,
                DateCreation = now.AddDays(-2)
            },
            new Ticket
            {
                Id = 2,
                Titre = "Ticket 2",
                Description = "Desc",
                StatutId = 4, // Clôturé
                PrioriteId = 2,
                CreateurId = 1,
                TechnicienId = 2,
                DateCreation = now.AddDays(-1),
                DateCloture = now
            },
            new Ticket
            {
                Id = 3,
                Titre = "Ticket 3",
                Description = "Desc",
                StatutId = 4, // Clôturé
                PrioriteId = 2,
                CreateurId = 1,
                TechnicienId = 2,
                DateCreation = now,
                DateCloture = now
            }
        );

        context.SaveChanges();
        return context;
    }

    [Fact]
    public async Task GetStats_ReturnsCorrectData()
    {
        // Arrange
        var context = GetInMemoryContext();
        var controller = new DashboardController(context);

        // Act
        var result = await controller.GetStats() as OkObjectResult;

        // Assert
        Assert.NotNull(result);

        // Convertir en JObject pour accéder aux propriétés anonymes
        var jObj = JObject.FromObject(result.Value);

        Assert.Equal(3, (int)jObj["totalTickets"]);
        Assert.Equal(66, (int)jObj["resolutionRate"]);
        Assert.Equal(1, (int)jObj["pendingTickets"]);
        Assert.Equal(1, (int)jObj["activeTechnicians"]);
        Assert.NotNull(jObj["avgResolutionTime"]);
    }

    [Fact]
    public async Task GetDailyTickets_ReturnsCountsForLast7Days()
    {
        // Arrange
        var context = GetInMemoryContext();
        var controller = new DashboardController(context);

        // Act
        var result = await controller.GetDailyTickets() as OkObjectResult;

        // Assert
        Assert.NotNull(result);

        // Convertir en JArray pour accéder aux propriétés "day" et "count"
        var jArray = JArray.FromObject(result.Value);

        // Vérifier qu'il y a bien 7 jours
        Assert.Equal(7, jArray.Count);

        // Vérifier que le jour d'aujourd'hui a bien 1 ticket
        var today = DateTime.Today;
        var todayData = jArray.First(d => (string)d["day"] == today.DayOfWeek.ToString().Substring(0, 3));
        Assert.Equal(1, (int)todayData["count"]);

        // Vérifier que le jour d'hier a bien 1 ticket (dans nos seeds)
        var yesterday = today.AddDays(-1);
        var yesterdayData = jArray.First(d => (string)d["day"] == yesterday.DayOfWeek.ToString().Substring(0, 3));
        Assert.Equal(1, (int)yesterdayData["count"]);
    }
}
