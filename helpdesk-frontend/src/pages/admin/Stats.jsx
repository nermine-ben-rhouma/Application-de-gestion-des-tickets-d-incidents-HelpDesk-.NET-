import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function Stats() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    resolutionRate: 0,
    avgResolutionTime: "0h",
    pendingTickets: 0,
  });
  const [dailyTickets, setDailyTickets] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Stats globales
        const statsRes = await api.get("/Dashboard/stats");
        setStats(statsRes.data);

        // 2️⃣ Tickets par jour (7 derniers jours)
        const dailyRes = await api.get("/Dashboard/daily");
        setDailyTickets(dailyRes.data);

        // 3️⃣ Historique des tickets (dernier 20)
        const historyRes = await api.get("/Tickets?take=20&order=desc");
        setHistory(historyRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement stats :", err);

        // Données fictives en cas d’erreur
        setStats({
          totalTickets: 127,
          resolutionRate: 87,
          avgResolutionTime: "4.2h",
          pendingTickets: 16,
        });

        setDailyTickets([
          { day: "Lun", count: 18 },
          { day: "Mar", count: 22 },
          { day: "Mer", count: 20 },
          { day: "Jeu", count: 25 },
          { day: "Ven", count: 28 },
          { day: "Sam", count: 15 },
          { day: "Dim", count: 8 },
        ]);

        setHistory([
          { id: 3, titre: "Problème Wi-Fi", technicienNom: "Sami", duree: "2h 15min", statut: "Résolu", dateCreation: "2024-01-15" },
        ]);

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxDaily = dailyTickets.length > 0 ? Math.max(...dailyTickets.map(d => d.count)) : 1;

  const getStatutBadge = (statut) => {
    const styles = {
      "Résolu": { bg: "#d1fae5", color: "#065f46" },
      "En cours": { bg: "#fef3c7", color: "#92400e" },
      "Nouveau": { bg: "#dbeafe", color: "#1e40af" },
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

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
        <div style={{ width: "260px", flexShrink: 0 }}><Sidebar /></div>
        <div style={{ flex: 1, padding: "40px", textAlign: "center" }}>
          <Navbar />
          <p style={{ marginTop: "100px", fontSize: "20px", color: "#666" }}>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "8px" }}>
            Historique & Statistiques
          </h1>
          <p style={{ color: "#666", marginBottom: "40px" }}>
            Analyse des performances et suivi des tickets
          </p>

          {/* Cartes statistiques */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: "40px", color: "#3b82f6" }}>📊</div>
              <h3>Total Tickets</h3>
              <h2 style={{ fontSize: "36px", margin: "10px 0" }}>{stats.totalTickets}</h2>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: "40px", color: "#16a34a" }}>✓</div>
              <h3>Taux de Résolution</h3>
              <h2 style={{ fontSize: "36px", margin: "10px 0" }}>{stats.resolutionRate}%</h2>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: "40px", color: "#f59e0b" }}>⏱</div>
              <h3>Temps Moyen</h3>
              <h2 style={{ fontSize: "36px", margin: "10px 0" }}>{stats.avgResolutionTime}</h2>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: "40px", color: "#ef4444" }}>⚠</div>
              <h3>En Attente</h3>
              <h2 style={{ fontSize: "36px", margin: "10px 0" }}>{stats.pendingTickets}</h2>
            </div>
          </div>

          {/* Graphiques et tickets par jour */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginBottom: "20px" }}>Tickets par jour</h3>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px" }}>
                {dailyTickets.map((d) => (
                  <div key={d.day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "40px",
                        height: `${(d.count / maxDaily) * 180 || 10}px`,
                        background: "#3b82f6",
                        borderRadius: "4px"
                      }}
                    />
                    <span style={{ marginTop: "10px", color: "#666" }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h3 style={{ marginBottom: "20px" }}>Taux de résolution</h3>
              <div style={{ position: "relative", width: "200px", height: "200px" }}>
                <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeDasharray={`${stats.resolutionRate} 100`}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <h2 style={{ fontSize: "40px", margin: 0 }}>{stats.resolutionRate}%</h2>
                  <p style={{ margin: 0, color: "#666" }}>Résolus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique détaillé */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 20px", color: "#4a5568" }}>Historique détaillé</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                  <th style={{ padding: "15px" }}>#</th>
                  <th style={{ padding: "15px" }}>TITRE</th>
                  <th style={{ padding: "15px" }}>TECHNICIEN</th>
                  <th style={{ padding: "15px" }}>DURÉE</th>
                  <th style={{ padding: "15px" }}>STATUT</th>
                  <th style={{ padding: "15px" }}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {history.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "15px" }}>{ticket.id}</td>
                    <td style={{ padding: "15px" }}>{ticket.titre}</td>
                    <td style={{ padding: "15px" }}>{ticket.technicienNom || "(non assigné)"}</td>
                    <td style={{ padding: "15px" }}>{ticket.duree || "-"}</td>
                    <td style={{ padding: "15px" }}>{getStatutBadge(ticket.statut)}</td>
                    <td style={{ padding: "15px" }}>{new Date(ticket.dateCreation).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
