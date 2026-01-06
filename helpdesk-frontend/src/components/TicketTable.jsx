import { useEffect, useState } from "react";
import { getAllTickets } from "../services/ticketService";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/date";

export default function TicketTable({ tickets: propTickets, loading: propLoading }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si des tickets sont passés en props (depuis le dashboard), on les utilise
    if (propTickets) {
      setTickets(propTickets);
      setLoading(propLoading ?? false);
      return;
    }

    // Sinon, on charge tous les tickets (mode autonome)
    getAllTickets()
      .then((data) => {
        // On prend seulement les 5 plus récents pour le dashboard
        const recent = data
          .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
          .slice(0, 5);
        setTickets(recent);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur chargement tickets :", error);
        setLoading(false);
      });
  }, [propTickets, propLoading]);

  if (loading) {
    return <p>Chargement des tickets...</p>;
  }

  if (tickets.length === 0) {
    return <p>Aucun ticket récent.</p>;
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 20px", fontSize: "20px", color: "#2c3e50" }}>
        Derniers tickets créés
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>#</th>
            <th style={{ padding: "12px" }}>Titre</th>
            <th style={{ padding: "12px" }}>Employé</th>
            <th style={{ padding: "12px" }}>Technicien</th>
            <th style={{ padding: "12px" }}>Statut</th>
            <th style={{ padding: "12px" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              style={{ borderBottom: "1px solid #eee" }}
            >
              <td style={{ padding: "12px" }}>{ticket.id}</td>
              <td style={{ padding: "12px", fontWeight: "500" }}>
                {ticket.titre}
              </td>
              {/* CORRECTION : utilisation du champ "createur" */}
              <td style={{ padding: "12px" }}>
                {ticket.createur?.trim() || "Inconnu"}
              </td>
              {/* CORRECTION : utilisation du champ "technicien" */}
              <td style={{ padding: "12px" }}>
                {ticket.technicien?.trim() || "-"}
              </td>
              <td style={{ padding: "12px" }}>
                <StatusBadge statut={ticket.statut} />
              </td>
              <td style={{ padding: "12px" }}>
                {formatDate(ticket.dateCreation)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}