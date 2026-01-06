import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function TechnicianDashboard({ currentUserId, currentUserRole }) {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistiques
  const [totalTickets, setTotalTickets] = useState(0);
  const [resolutionRate, setResolutionRate] = useState(0);
  const [pendingTickets, setPendingTickets] = useState(0);

  // Modal changement de statut
  const [showStatutModal, setShowStatutModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [newStatutId, setNewStatutId] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/Tickets")
      .then((res) => {
        let data = res.data;

        if (currentUserRole === "TechnicienId") {
          data = data.filter(t => t.technicienId === currentUserId);
        }

        setTickets(data);
        setFilteredTickets(data);
        calculStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement tickets :", err);
        setLoading(false);
      });
  }, [currentUserId, currentUserRole]);

  const calculStats = (data) => {
    setTotalTickets(data.length);

    const resolved = data.filter(
      t => t.statut === "Résolu" || t.statut === "Fermé" || t.statut === "Clôturé"
    ).length;

    setResolutionRate(data.length ? Math.round((resolved / data.length) * 100) : 0);

    setPendingTickets(
      data.filter(
        t => t.statut !== "Résolu" && t.statut !== "Fermé" && t.statut !== "Clôturé"
      ).length
    );
  };

  const getStatutName = (statutId) => {
    const map = {
      1: "Nouveau",
      2: "En cours",
      3: "Résolu",
      4: "Fermé",
    };
    return map[statutId] || "Inconnu";
  };

  const openStatutModal = (ticket) => {
    setCurrentTicket(ticket);
    setNewStatutId(ticket.statutId || 1);
    setShowStatutModal(true);
  };

  const handleStatutChange = async () => {
    if (!currentTicket) return;
    setSaving(true);

    try {
      await api.put(`/Tickets/${currentTicket.id}/statut`, {
        statutId: newStatutId,
      });

      const updatedTickets = tickets.map((t) =>
        t.id === currentTicket.id
          ? { ...t, statutId: newStatutId, statut: getStatutName(newStatutId) }
          : t
      );

      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);
      calculStats(updatedTickets);
      setShowStatutModal(false);
    } catch (err) {
      console.error("Erreur changement statut :", err);
      alert("Erreur lors du changement de statut");
    } finally {
      setSaving(false);
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      "Nouveau": { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
      "En cours": { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
      "Résolu": { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
      "Fermé": { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
      "Clôturé": { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
    };
    const style = styles[statut] || { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" };

    return (
      <span style={{
        padding: "8px 16px",
        borderRadius: "9999px",
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: "600",
        fontSize: "13px",
        border: `1px solid ${style.border}`,
        display: "inline-block"
      }}>
        {statut}
      </span>
    );
  };

  const getPrioriteBadge = (priorite) => {
    const styles = {
      "Basse": { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
      "Moyenne": { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
      "Haute": { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
    };
    const style = styles[priorite] || { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" };

    return (
      <span style={{
        padding: "8px 16px",
        borderRadius: "9999px",
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: "600",
        fontSize: "13px",
        border: `1px solid ${style.border}`,
        display: "inline-block"
      }}>
        {priorite}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ width: "260px", flexShrink: 0, background: "#ffffff", boxShadow: "2px 0 10px rgba(0,0,0,0.05)" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "12px"
          }}>
            Dashboard Technicien
          </h1>
          <p style={{ color: "#64748b", marginBottom: "40px" }}>
            Gérez vos tickets et suivez vos performances
          </p>

          {/* Cartes statistiques */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
            <div style={statCardStyle("#3b82f6", "🎟️")}>
              <div style={{ fontSize: "48px", opacity: 0.2 }}>{/* Icône */}🎟️</div>
              <h3 style={{ fontSize: "16px", color: "#64748b", margin: "0 0 8px 0" }}>Total tickets</h3>
              <p style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{totalTickets}</p>
            </div>

            <div style={statCardStyle("#10b981", "✅")}>
              <div style={{ fontSize: "48px", opacity: 0.2 }}>✅</div>
              <h3 style={{ fontSize: "16px", color: "#64748b", margin: "0 0 8px 0" }}>Taux de résolution</h3>
              <p style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{resolutionRate}%</p>
            </div>

            <div style={statCardStyle("#f59e0b", "⏳")}>
              <div style={{ fontSize: "48px", opacity: 0.2 }}>⏳</div>
              <h3 style={{ fontSize: "16px", color: "#64748b", margin: "0 0 8px 0" }}>En attente</h3>
              <p style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{pendingTickets}</p>
            </div>
          </div>

          {/* Table des tickets */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                Liste des tickets
              </h2>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px" }}>
                <p style={{ color: "#64748b", fontSize: "18px" }}>Chargement des tickets...</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>TITRE</th>
                      <th style={thStyle}>CRÉATEUR</th>
                      <th style={thStyle}>TECHNICIEN</th>
                      <th style={thStyle}>PRIORITÉ</th>
                      <th style={thStyle}>STATUT</th>
                      <th style={thStyle}>DATE CRÉATION</th>
                      <th style={thStyle}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket, index) => (
                      <tr
                        key={ticket.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                          transition: "background-color 0.2s",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eff6ff"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafc"}
                      >
                        <td style={tdStyle}>#{ticket.id}</td>
                        <td style={tdStyle}><strong>{ticket.titre}</strong></td>
                        <td style={tdStyle}>{ticket.createur || "Inconnu"}</td>
                        <td style={tdStyle}>{ticket.technicien || "(non assigné)"}</td>
                        <td style={tdStyle}>{getPrioriteBadge(ticket.priorite)}</td>
                        <td style={tdStyle}>{getStatutBadge(ticket.statut)}</td>
                        <td style={tdStyle}>{new Date(ticket.dateCreation).toLocaleDateString("fr-FR")}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => openStatutModal(ticket)}
                            style={{
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
                          >
                            Changer statut
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showStatutModal && currentTicket && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50
        }}>
          <div style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            width: "480px",
            maxWidth: "90vw",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", margin: "0 0 24px 0" }}>
              Changer le statut du ticket #{currentTicket.id}
            </h2>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#475569", marginBottom: "8px" }}><strong>Titre :</strong> {currentTicket.titre}</p>
            </div>

            <select
              value={newStatutId}
              onChange={(e) => setNewStatutId(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                backgroundColor: "#f8fafc",
                marginBottom: "32px"
              }}
            >
              <option value={1}>Nouveau</option>
              <option value={2}>En cours</option>
              <option value={3}>Résolu</option>
              <option value={4}>Fermé</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowStatutModal(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleStatutChange}
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? "Sauvegarde..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles réutilisables
const statCardStyle = (color, icon) => ({
  background: "#ffffff",
  padding: "28px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${color}20`
});

const thStyle = {
  padding: "20px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #e2e8f0"
};

const tdStyle = {
  padding: "20px 16px",
  fontSize: "15px",
  color: "#334155",
  borderBottom: "1px solid #f1f5f9"
};