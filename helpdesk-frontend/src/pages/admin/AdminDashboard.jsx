import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import TicketTable from "../../components/TicketTable";
import api from "../../services/api";

export default function AdminDashboard({ currentUserId }) {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
    activeTechnicians: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTickets = await api.get("/Tickets");
        const allTickets = resTickets.data;

        setTickets(allTickets);

        // Statistiques
        const total = allTickets.length;
        const resolved = allTickets.filter(t => ["Résolu", "Fermé", "Clôturé"].includes(t.statut)).length;
        const open = allTickets.filter(t => ["Nouveau", "En cours"].includes(t.statut)).length;
        const pending = total - resolved;

        // Calcul du nombre de techniciens actifs (uniques ayant au moins un ticket)
        const activeTechniciansSet = new Set(
          allTickets
            .filter(t => t.technicien)       // tickets avec technicien assigné
            .map(t => t.technicien.trim())   // nom complet du technicien
        );

        setStats({
          totalTickets: total,
          openTickets: open,
          resolvedTickets: resolved,
          pendingTickets: pending,
          activeTechnicians: activeTechniciansSet.size,
        });
      } catch (err) {
        console.error("Erreur chargement tickets/stats :", err);
        setStats({
          totalTickets: 0,
          openTickets: 0,
          resolvedTickets: 0,
          pendingTickets: 0,
          activeTechnicians: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "40px" }}>
            Dashboard Admin
          </h1>

          {/* Cartes statistiques */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "25px",
              marginBottom: "50px",
            }}
          >
            <StatCard
              title="Total tickets"
              value={loading ? "..." : stats.totalTickets}
              icon="📊"
              color="#dbeafe"
              textColor="#1e40af"
            />
            <StatCard
              title="Tickets en cours"
              value={loading ? "..." : stats.openTickets}
              icon="⏳"
              color="#fffbeb"
              textColor="#d97706"
            />
            <StatCard
              title="Tickets résolus"
              value={loading ? "..." : stats.resolvedTickets}
              icon="✅"
              color="#d1fae5"
              textColor="#065f46"
            />
            <StatCard
              title="Techniciens actifs"
              value={loading ? "..." : stats.activeTechnicians}
              icon="👥"
              color="#e9d5ff"
              textColor="#9333ea"
            />
          </div>

          {/* Tableau des tickets */}
          <h2 style={{ fontSize: "22px", color: "#2c3e50", marginBottom: "20px" }}>
            Derniers tickets créés
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <TicketTable tickets={tickets} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
