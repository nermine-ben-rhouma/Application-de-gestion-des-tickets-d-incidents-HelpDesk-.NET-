# 🎫 Application de Gestion de Tickets (Helpdesk)

## 📌 Présentation du projet

Ce projet consiste à développer une application web de gestion des tickets d’incidents (HelpDesk .NET) permettant aux employés de déclarer des problèmes techniques, aux techniciens de les traiter, et à l’administrateur de superviser l’ensemble du processus.

L’objectif est de centraliser le suivi des incidents, d’assurer la traçabilité des interventions et d’améliorer la qualité du support technique. L’application est basée sur l’architecture N-tiers en ASP.NET Core avec une base de données SQL Server, et inclura un système d’authentification par rôles (Administrateur, Technicien, Employé).

---

## 🎯 Objectifs du projet

- Concevoir une base de données relationnelle sous SQL Server pour la gestion des utilisateurs, des tickets et des interventions.
-Développer une interface web dynamique avec ASP.NET Core MVC, HTML, CSS et
JavaScript.
- Mettre en place un système d’authentification (Administrateur, Technicien, Employé).
- Gérer le cycle de vie d’un ticket : création, assignation, clôture.
- Intégrer des tests unitaires et fonctionnels (Squash TM) pour valider le bon fonctionnement de l’application.
- Utiliser AzureDevops comme outil de gestion de projet pour le suivi et la traçabilité

---

## 🧱 Architecture du projet

Le projet suit une **architecture N-tiers** :

Frontend (React)
|
| HTTP / JSON
↓
Backend API (ASP.NET Core)
|
↓
Base de données (SQL Server via Entity Framework Core)



### Couches principales :
- **Entities** : modèles de données
- **DTOs** : objets de transfert (lecture / écriture)
- **Controllers** : endpoints REST
- **Context** : accès base de données (EF Core)

---

## ⚙️ Technologies utilisées

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger (documentation API)
- Upload de fichiers

### Frontend
- React.js
- Axios
- React Hooks
- Dashboard dynamique

## 🧪 Tests et validation

Le projet intègre des tests unitaires pour garantir le bon fonctionnement des controllers et de la logique métier.

Frameworks utilisés

xUnit pour les tests unitaires

InMemoryDatabase EF Core pour simuler la base sans toucher à la production

Newtonsoft.Json pour lire les objets anonymes renvoyés par l’API

Controllers testés
Controller	Méthodes testées	Description
TicketsController	CreateTicket, ChangeStatut	Vérifie la création de tickets, le changement de statut et la gestion des statuts invalides
DashboardController	GetStats, GetDailyTickets	Vérifie les statistiques globales et le nombre de tickets par jour sur les 7 derniers jours

