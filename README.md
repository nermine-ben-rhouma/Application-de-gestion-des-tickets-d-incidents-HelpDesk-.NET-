# 🎫 Application de Gestion de Tickets (Helpdesk)

## 📌 Présentation du projet

Ce projet est une **application web de gestion de tickets (Helpdesk)** réalisée dans le cadre d’un **projet académique**.  
Elle permet de gérer les incidents et demandes utilisateurs avec un **workflow clair**, une **assignation aux techniciens**, et un **suivi complet du cycle de vie des tickets**.

L’application est développée selon une **architecture N-Tiers**, avec un **backend ASP.NET Core Web API** et un **frontend React.js**.

---

## 🎯 Objectifs du projet

- Centraliser les demandes d’assistance informatique
- Permettre la création et le suivi des tickets
- Gérer les statuts et priorités des tickets
- Assigner les tickets à des techniciens
- Offrir un dashboard dédié aux techniciens
- Appliquer un workflow métier réaliste

---

## 🧱 Architecture du projet

Le projet suit une **architecture N-Tiers** :

Frontend (React)
|
| HTTP / JSON
↓
Backend API (ASP.NET Core)
|
↓
Base de données (SQL Server via Entity Framework Core)

markdown
Copier le code

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

---

## 📂 Modèle de données (Entities)

### Ticket
- Id
- Titre
- Description
- DateCreation
- DateCloture
- Statut
- Priorite
- Createur
- Technicien
- Fichier joint (optionnel)

### User
- Id
- Nom
- Prénom
- Rôle (Utilisateur / Technicien)

### Statut
- Nouveau
- En cours
- Résolu
- Clôturé

### Priorité
- Basse
- Moyenne
- Haute

---

## 🔄 Workflow métier des tickets

1. Création du ticket par un utilisateur
2. Attribution à un technicien
3. Passage du statut :
   - Nouveau → En cours → Résolu / Clôturé
4. Lorsqu’un ticket est **clôturé**, la date de clôture est automatiquement enregistrée

---

## 🔌 Fonctionnalités Backend (API)

### Tickets
- `GET /api/Tickets` : récupérer tous les tickets
- `GET /api/Tickets/{id}` : récupérer un ticket par ID
- `POST /api/Tickets` : créer un ticket (avec fichier)
- `PUT /api/Tickets/{id}/statut` : changer le statut d’un ticket
- `DELETE /api/Tickets/{id}` : supprimer un ticket

### Particularités
- Utilisation de **DTOs** pour éviter les boucles JSON
- Gestion des relations avec `Include`
- Upload et suppression de fichiers joints
- Validation des statuts

---

## 🖥️ Frontend – Dashboard Technicien

### Fonctionnalités :
- Affichage **uniquement des tickets assignés au technicien connecté**
- Statistiques :
  - Nombre total de tickets
  - Taux de résolution (%)
  - Tickets en attente
- Liste des tickets avec :
  - Priorité
  - Statut
  - Créateur
  - Date
- Bouton pour **changer le statut du ticket**

---

## 🛡️ Gestion des rôles

- **Utilisateur** :
  - Créer un ticket
  - Consulter ses tickets

- **Technicien** :
  - Voir uniquement les tickets qui lui sont assignés
  - Changer le statut des tickets
  - Suivre les performances (dashboard)

---

## 🚀 Lancement du projet

### Backend
```bash
dotnet restore
dotnet ef database update
dotnet run
Frontend
bash
Copier le code
npm install
npm start
📄 Documentation API
La documentation Swagger est disponible à l’adresse :

bash
Copier le code
http://localhost:PORT/swagger
✅ État du projet
✔ Architecture terminée
✔ Backend fonctionnel
✔ Frontend fonctionnel
✔ Workflow métier implémenté
