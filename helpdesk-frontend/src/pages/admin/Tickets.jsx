import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [prioriteFilter, setPrioriteFilter] = useState("Tous");

  // Modal pour changer le statut
  const [showStatutModal, setShowStatutModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [newStatutId, setNewStatutId] = useState(1);
  const [saving, setSaving] = useState(false);

  // Confirmation suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get("/Tickets")
      .then((res) => {
        setTickets(res.data);
        setFilteredTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement tickets :", err);
        setLoading(false);
      });
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = tickets;

    if (search) {
      filtered = filtered.filter((t) =>
        t.titre.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (statutFilter !== "Tous") {
      filtered = filtered.filter((t) => t.statut === statutFilter);
    }
    if (prioriteFilter !== "Tous") {
      filtered = filtered.filter((t) => t.priorite === prioriteFilter);
    }

    setFilteredTickets(filtered);
  }, [search, statutFilter, prioriteFilter, tickets]);

  const openStatutModal = (ticket) => {
    setCurrentTicket(ticket);
    setNewStatutId(ticket.statutId || 1);
    setShowStatutModal(true);
  };

  const handleStatutChange = async () => {
    setSaving(true);

    try {
      await api.put(`/Tickets/${currentTicket.id}/statut`, {
        statutId: newStatutId
      });

      const updatedTickets = tickets.map((t) =>
        t.id === currentTicket.id
          ? { ...t, statutId: newStatutId, statut: getStatutName(newStatutId) }
          : t
      );
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);

      setShowStatutModal(false);
    } catch (err) {
      console.error("Erreur changement statut :", err);
      alert("Erreur lors du changement de statut");
    } finally {
      setSaving(false);
    }
  };

  // Fonction suppression
  const openDeleteConfirm = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    setDeleting(true);

    try {
      await api.delete(`/Tickets/${ticketToDelete.id}`);

      const updatedTickets = tickets.filter(t => t.id !== ticketToDelete.id);
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);

      setShowDeleteConfirm(false);
      setTicketToDelete(null);
    } catch (err) {
      console.error("Erreur suppression ticket :", err);
      alert("Erreur lors de la suppression du ticket");
    } finally {
      setDeleting(false);
    }
  };

  const getStatutName = (statutId) => {
    const map = {
      1: "Nouveau",
      2: "En cours",
      3: "Résolu",
      4: "Fermé"
    };
    return map[statutId] || "Inconnu";
  };

  const getStatutBadge = (statut) => {
    const styles = {
      "Nouveau": { bg: "#dbeafe", color: "#1e40af" },
      "En cours": { bg: "#fffbeb", color: "#d97706" },
      "Résolu": { bg: "#d1fae5", color: "#065f46" },
      "Fermé": { bg: "#e5e7eb", color: "#4b5563" },
      "Clôturé": { bg: "#e5e7eb", color: "#4b5563" },
    };
    const style = styles[statut] || { bg: "#e5e7eb", color: "#4b5563" };
    return (
      <span style={{
        padding: "6px 12px",
        borderRadius: "20px",
        background: style.bg,
        color: style.color,
        fontWeight: "bold",
        fontSize: "13px"
      }}>
        {statut}
      </span>
    );
  };

  const getPrioriteBadge = (priorite) => {
    const styles = {
      "Basse": { bg: "#d1fae5", color: "#065f46" },
      "Moyenne": { bg: "#fef3c7", color: "#92400e" },
      "Haute": { bg: "#fee2e2", color: "#991b1b" },
    };
    const style = styles[priorite] || { bg: "#e5e7eb", color: "#4b5563" };
    return (
      <span style={{
        padding: "6px 12px",
        borderRadius: "20px",
        background: style.bg,
        color: style.color,
        fontWeight: "bold",
        fontSize: "13px"
      }}>
        {priorite}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          {/* Titre + Bouton Nouveau ticket */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "30px" 
          }}>
            <h1 style={{ fontSize: "28px", color: "#2c3e50", margin: 0 }}>
              Tous les tickets
            </h1>

            <Link
              to="/admin/new-ticket"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span> Nouveau ticket
            </Link>
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                padding: "12px", 
                width: "300px", 
                borderRadius: "8px", 
                border: "1px solid #ddd",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
            />
            <select 
              value={statutFilter} 
              onChange={(e) => setStatutFilter(e.target.value)} 
              style={{ 
                padding: "12px", 
                borderRadius: "8px", 
                border: "1px solid #ddd" 
              }}
            >
              <option value="Tous">Tous les statuts</option>
              <option>Nouveau</option>
              <option>En cours</option>
              <option>Résolu</option>
              <option>Fermé</option>
              <option>Clôturé</option>
            </select>
            <select 
              value={prioriteFilter} 
              onChange={(e) => setPrioriteFilter(e.target.value)} 
              style={{ 
                padding: "12px", 
                borderRadius: "8px", 
                border: "1px solid #ddd" 
              }}
            >
              <option value="Tous">Toutes les priorités</option>
              <option>Basse</option>
              <option>Moyenne</option>
              <option>Haute</option>
            </select>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <p style={{ textAlign: "center", padding: "60px" }}>Chargement...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                    <th style={{ padding: "15px" }}>#</th>
                    <th style={{ padding: "15px" }}>TITRE</th>
                    <th style={{ padding: "15px" }}>CRÉATEUR</th>
                    <th style={{ padding: "15px" }}>TECHNICIEN</th>
                    <th style={{ padding: "15px" }}>PRIORITÉ</th>
                    <th style={{ padding: "15px" }}>STATUT</th>
                    <th style={{ padding: "15px" }}>DATE</th>
                    <th style={{ padding: "15px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px" }}>{ticket.id}</td>
                      <td style={{ padding: "15px" }}>
                        <Link to={`/tickets/${ticket.id}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
                          {ticket.titre}
                        </Link>
                      </td>
                      <td style={{ padding: "15px" }}>{ticket.createur?.trim() || "Inconnu"}</td>
                      <td style={{ padding: "15px" }}>{ticket.technicien?.trim() || "(non assigné)"}</td>
                      <td style={{ padding: "15px" }}>{getPrioriteBadge(ticket.priorite)}</td>
                      <td style={{ padding: "15px" }}>{getStatutBadge(ticket.statut)}</td>
                      <td style={{ padding: "15px" }}>{new Date(ticket.dateCreation).toLocaleDateString("fr-FR")}</td>
                      <td style={{ padding: "15px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                          onClick={() => openStatutModal(ticket)}
                          style={{ 
                            background: "none", 
                            border: "none", 
                            cursor: "pointer", 
                            fontSize: "18px",
                            color: "#3b82f6",
                            padding: "8px"
                          }}
                          title="Changer le statut"
                        >
                          ✏️
                        </button>

                        {/* BOUTON SUPPRIMER AJOUTÉ */}
                        <button
                          onClick={() => openDeleteConfirm(ticket)}
                          style={{ 
                            background: "none", 
                            border: "none", 
                            cursor: "pointer", 
                            fontSize: "18px",
                            color: "#ef4444",
                            padding: "8px"
                          }}
                          title="Supprimer le ticket"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal changement de statut */}
      {showStatutModal && currentTicket && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            width: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "24px" }}>
              Changer le statut du ticket #{currentTicket.id}
            </h2>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
              Nouveau statut
            </label>
            <select
              value={newStatutId}
              onChange={(e) => setNewStatutId(Number(e.target.value))}
              style={{ 
                width: "100%", 
                padding: "12px", 
                marginBottom: "30px", 
                borderRadius: "8px", 
                border: "1px solid #ddd" 
              }}
            >
              <option value={1}>Nouveau</option>
              <option value={2}>En cours</option>
              <option value={3}>Résolu</option>
              <option value={4}>Fermé</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
              <button
                onClick={() => setShowStatutModal(false)}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #ddd",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleStatutChange}
                disabled={saving}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteConfirm && ticketToDelete && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            width: "420px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", color: "#ef4444", marginBottom: "20px" }}>
              ⚠️
            </div>
            <h2 style={{ margin: "0 0 15px", fontSize: "22px" }}>
              Supprimer le ticket #{ticketToDelete.id} ?
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
              Êtes-vous sûr de vouloir supprimer le ticket "<strong>{ticketToDelete.titre}</strong>" ?<br />
              Cette action est irréversible.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setTicketToDelete(null);
                }}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #ddd",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  opacity: deleting ? 0.7 : 1
                }}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}