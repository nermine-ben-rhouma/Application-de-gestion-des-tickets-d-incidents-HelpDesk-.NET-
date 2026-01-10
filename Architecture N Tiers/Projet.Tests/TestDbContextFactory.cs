using Microsoft.EntityFrameworkCore;
using Projet.Context;
using Projet.Entities;

public static class TestDbContextFactory
{
    public static DataContext Create()
    {
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var context = new DataContext(options);

        // Applique seeds de OnModelCreating
        context.Database.EnsureCreated();

        // Seed Users pour tests
        context.Users.AddRange(
            new User
            {
                Id = 1,
                Nom = "Test",
                Prenom = "Createur",
                Email = "createur@test.com",
                MotDePasse = "pass123",
                RoleId = 3
            },
            new User
            {
                Id = 2,
                Nom = "Test",
                Prenom = "Technicien",
                Email = "tech@test.com",
                MotDePasse = "pass123",
                RoleId = 2
            }
        );

        context.SaveChanges();
        return context;
    }
}
