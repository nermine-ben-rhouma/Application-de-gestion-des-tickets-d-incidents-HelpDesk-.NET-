import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function TechnicienHistorique({ currentUserId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/Tickets")
      .then((res) => {
        const techTickets = res.data.filter(
          t => t.technicienId === currentUserId
        );
        setTickets(techTickets);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement tickets :", err);
        setLoading(false);
      });
  }, [currentUserId]);

  const getBadge = (type, value) => {
    const styles = {
      statut: {
        "Nouveau": { bg: "#dbeafe", color: "#1e40af" },
        "En cours": { bg: "#fffbeb", color: "#92400e" },
        "Résolu": { bg: "#d1fae5", color: "#065f46" },
        "Fermé": { bg: "#e5e7eb", color: "#4b5563" },
        "Clôturé": { bg: "#e5e7eb", color: "#4b5563" },
      },
      priorite: {
        "Basse": { bg: "#d1fae5", color: "#065f46" },
        "Moyenne": { bg: "#fef3c7", color: "#92400e" },
        "Haute": { bg: "#fee2e2", color: "#991b1b" },
      }
    };

    const style = styles[type][value] || {
      bg: "#e5e7eb",
      color: "#4b5563"
    };

    return (
      <span
        style={{
          padding: "5px 12px",
          borderRadius: "999px",
          background: style.bg,
          color: style.color,
          fontWeight: "600",
          fontSize: "12px"
        }}
      >
        {value}
      </span>
    );
  };

  const filteredTickets = tickets.filter(t =>
    t.titre.toLowerCase().includes(search.toLowerCase()) ||
    (t.description &&
      t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          background: "#f3f4f6"
        }}
      >
        <Navbar />

        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Historique de vos tickets
          </h1>

          <input
            type="text"
            placeholder="Rechercher un ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "420px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              marginBottom: "28px"
            }}
          />

          {loading ? (
            <p style={{ textAlign: "center", padding: "60px" }}>
              Chargement...
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px"
              }}
            >
              {filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <h3>{ticket.titre}</h3>

                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "14px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical"
                    }}
                  >
                    {ticket.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "auto"
                    }}
                  >
                    {getBadge("priorite", ticket.priorite)}
                    {getBadge("statut", ticket.statut)}
                  </div>

                  {/* ✅ LIEN CORRIGÉ */}
                  <Link
                    to={`/technician/tickets/${ticket.id}`}
                    style={{
                      marginTop: "14px",
                      alignSelf: "flex-end",
                      color: "#2563eb",
                      fontWeight: "600",
                      textDecoration: "none"
                    }}
                  >
                    Voir détails →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
