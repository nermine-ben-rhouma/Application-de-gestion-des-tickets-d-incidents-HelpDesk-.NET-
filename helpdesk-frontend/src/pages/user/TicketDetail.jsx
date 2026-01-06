import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// Badges
const StatusBadge = ({ statut }) => {
  const styles = {
    "Nouveau": { bg: "#dbeafe", color: "#1e40af" },
    "En cours": { bg: "#fffbeb", color: "#d97706" },
    "Résolu": { bg: "#d1fae5", color: "#065f46" },
    "Fermé": { bg: "#e5e7eb", color: "#4b5563" },
  };
  const style = styles[statut] || { bg: "#e5e7eb", color: "#4b5563" };

  return (
    <span style={{
      padding: "8px 16px",
      borderRadius: "999px",
      backgroundColor: style.bg,
      color: style.color,
      fontWeight: "bold",
      fontSize: "14px",
      textTransform: "uppercase",
    }}>
      {statut}
    </span>
  );
};

const PriorityBadge = ({ priorite }) => {
  const styles = {
    "Basse": { bg: "#d1fae5", color: "#065f46" },
    "Moyenne": { bg: "#fef3c7", color: "#92400e" },
    "Haute": { bg: "#fee2e2", color: "#991b1b" },
  };
  const style = styles[priorite] || { bg: "#e5e7eb", color: "#4b5563" };

  return (
    <span style={{
      padding: "8px 16px",
      borderRadius: "999px",
      backgroundColor: style.bg,
      color: style.color,
      fontWeight: "bold",
      fontSize: "14px",
    }}>
      {priorite}
    </span>
  );
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nom de l'employé connecté
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const userName = `${user.prenom || ""} ${user.nom || ""}`.trim() || "Employé";

  useEffect(() => {
    api.get(`/Tickets/${id}`)
      .then((res) => {
        setTicket(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement ticket :", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#9ca3af" }}>
        Chargement du ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "#ef4444" }}>
        Ticket non trouvé.
      </div>
    );
  }

  // URL du fichier joint (ajuste le port si besoin)
  const fichierUrl = ticket.fichierUrl 
    ? `http://localhost:2093${ticket.fichierUrl}`
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#3b82f6",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => navigate("/user/tickets")}
        >
          ← Retour à mes tickets
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#4b5563" }}>
            Employé : <strong>{userName}</strong>
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Contenu */}
      <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", color: "#1e293b", marginBottom: "24px" }}>
          Ticket #{ticket.id} - {ticket.titre}
        </h1>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Infos principales */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
              }}
            >
              <div>
                <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "14px" }}>
                  Statut
                </p>
                <StatusBadge statut={ticket.statut} />
              </div>
              <div>
                <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "14px" }}>
                  Priorité
                </p>
                <PriorityBadge priorite={ticket.priorite} />
              </div>
              <div>
                <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "14px" }}>
                  Technicien assigné
                </p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                  {ticket.technicien?.trim() || "(non assigné)"}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "14px" }}>
                  Date de création
                </p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                  {new Date(ticket.dateCreation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            {ticket.typeIncident && (
              <div style={{ marginTop: "32px" }}>
                <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "14px" }}>
                  Type d'incident
                </p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                  {ticket.typeIncident}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "20px", color: "#1e293b", marginBottom: "16px", fontWeight: "600" }}>
              Description du problème
            </h3>
            <div
              style={{
                background: "#f8fafc",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#374151",
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.description || "Aucune description fournie."}
            </div>
          </div>

          {/* Pièce jointe */}
          {fichierUrl && (
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "20px", color: "#1e293b", marginBottom: "16px", fontWeight: "600" }}>
                Pièce jointe
              </h3>
              {fichierUrl.toLowerCase().endsWith(".pdf") ? (
                <a
                  href={fichierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 24px",
                    background: "#3b82f6",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  📄 Ouvrir le PDF dans un nouvel onglet
                </a>
              ) : (
                <img
                  src={fichierUrl}
                  alt="Pièce jointe"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </div>
          )}

          {/* Bouton retour */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              onClick={() => navigate("/user/tickets")}
              style={{
                padding: "14px 32px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              ← Retour à mes tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}