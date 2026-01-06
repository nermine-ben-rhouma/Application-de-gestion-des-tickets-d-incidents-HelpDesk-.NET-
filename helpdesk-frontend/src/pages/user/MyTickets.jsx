import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const fullName = user ? `${user.nom} ${user.prenom}` : "";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/Tickets")
      .then(res => {
        const myTickets = res.data.filter(
          t => t.createur?.trim() === fullName
        );
        setTickets(myTickets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [fullName, navigate, user]);

  const badge = (text, bg, color) => (
    <span style={{
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      backgroundColor: bg,
      color
    }}>
      {text}
    </span>
  );

  const statutBadge = (s) => {
    if (s === "Nouveau") return badge(s, "#e0f2fe", "#0369a1");
    if (s === "En cours") return badge(s, "#fef3c7", "#92400e");
    if (s === "Résolu") return badge(s, "#dcfce7", "#166534");
    if (s === "Fermé") return badge(s, "#e5e7eb", "#374151");
    return s;
  };

  const prioriteBadge = (p) => {
    if (p === "Basse") return badge(p, "#dcfce7", "#166534");
    if (p === "Moyenne") return badge(p, "#fef3c7", "#92400e");
    if (p === "Haute") return badge(p, "#fee2e2", "#991b1b");
    return p;
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{
        marginLeft: "260px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}>

            {/* HEADER (BOUTON SUPPRIMÉ) */}
            <div style={{ marginBottom: "30px" }}>
              <h1 style={{ margin: 0, fontSize: "26px" }}>🎫 Mes tickets</h1>
              <p style={{ color: "#64748b", marginTop: "5px" }}>
                Liste des tickets que vous avez créés
              </p>
            </div>

            {/* TABLE */}
            {loading ? (
              <p>Chargement...</p>
            ) : tickets.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>
                Aucun ticket trouvé.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["#", "Titre", "Priorité", "Statut", "Date"].map(h => (
                        <th key={h} style={{
                          textAlign: "left",
                          padding: "14px",
                          color: "#475569",
                          fontSize: "14px"
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {tickets.map(t => (
                      <tr
                        key={t.id}
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px" }}>{t.id}</td>
                        <td style={{ padding: "14px", fontWeight: "600" }}>{t.titre}</td>
                        <td style={{ padding: "14px" }}>{prioriteBadge(t.priorite)}</td>
                        <td style={{ padding: "14px" }}>{statutBadge(t.statut)}</td>
                        <td style={{ padding: "14px", color: "#64748b" }}>
                          {new Date(t.dateCreation).toLocaleDateString("fr-FR")}
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
    </div>
  );
}
