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

