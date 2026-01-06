using Microsoft.EntityFrameworkCore;
using Projet.Entities;

namespace Projet.Context
{
    public class DataContext : DbContext
    {
        
            public DataContext(DbContextOptions<DataContext> options)
                : base(options)
            {
            }

            public DbSet<User> Users { get; set; }
            public DbSet<Role> Roles { get; set; }
            public DbSet<Ticket> Tickets { get; set; }
            public DbSet<Commentaire> Commentaires { get; set; }
            public DbSet<Statut> Statuts { get; set; }
            public DbSet<Priorite> Priorites { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                // Ticket -> Createur
                modelBuilder.Entity<Ticket>()
                    .HasOne(t => t.Createur)
                    .WithMany(u => u.TicketsCrees)
                    .HasForeignKey(t => t.CreateurId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Ticket -> Technicien
                modelBuilder.Entity<Ticket>()
                    .HasOne(t => t.Technicien)
                    .WithMany(u => u.TicketsAssignes)
                    .HasForeignKey(t => t.TechnicienId)
                    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Statut)
            .WithMany(s => s.Tickets)
            .HasForeignKey(t => t.StatutId);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Priorite)
                .WithMany(p => p.Tickets)
                .HasForeignKey(t => t.PrioriteId);




            // Seed Roles (IMPORTANT)
            modelBuilder.Entity<Role>().HasData(
                    new Role { Id = 1, NomRole = "Administrateur" },
                    new Role { Id = 2, NomRole = "Technicien" },
                    new Role { Id = 3, NomRole = "Employe" }
                );
            modelBuilder.Entity<Statut>().HasData(
             new Statut{ Id = 1, NomStatut= "Nouveau" },
              new Statut { Id = 2, NomStatut = "En cours" },
              new Statut { Id = 3, NomStatut = "Résolu" },
              new Statut { Id = 4, NomStatut = "Clôturé" }
);

            modelBuilder.Entity<Priorite>().HasData(
                new Priorite { Id = 1, NomPriorite = "Basse" },
                new Priorite { Id = 2, NomPriorite  = "Moyenne" },
                new Priorite { Id = 3, NomPriorite = "Haute" },
                new Priorite { Id = 4, NomPriorite = "Critique" }
            );


        }
    }
    }
