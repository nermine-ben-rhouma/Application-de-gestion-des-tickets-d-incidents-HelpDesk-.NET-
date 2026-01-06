import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/Tickets/${id}`),
      api.get(`/Commentaire/ticket/${id}`)
    ])
      .then(([ticketRes, commentRes]) => {
        setTicket(ticketRes.data);
        setCommentaires(commentRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const envoyerCommentaire = async () => {
    if (!newComment.trim()) return;

    await api.post("/Commentaire", {
      contenu: newComment,
      ticketId: ticket.id,
      userId: JSON.parse(localStorage.getItem("user")).id
    });

    setNewComment("");
    const res = await api.get(`/Commentaire/ticket/${id}`);
    setCommentaires(res.data);
  };

  if (loading)
    return <div style={styles.loading}>Chargement...</div>;

  if (!ticket)
    return <div style={styles.loading}>Ticket introuvable</div>;

  return (
    <>
      <Sidebar />

      <div style={styles.page}>
        <Navbar />

        <div style={styles.container}>
          <Link to="/technician/tickets" style={styles.back}>
            ← Retour à la liste
          </Link>

          {/* Titre */}
          <div style={styles.card}>
            <h1 style={styles.title}>{ticket.titre}</h1>
          </div>

          {/* Infos générales */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Informations générales</h3>

            <div style={styles.grid}>
              <Info label="N° Ticket" value={`#${ticket.id}`} />
              <Info label="Date de création" value={ticket.dateCreation} />
              <Info label="Créé par" value={ticket.createur} />
              <Info label="Technicien" value={ticket.technicien ?? "—"} />
              <Info
                label="Statut"
                value={
                  <span style={{ ...styles.badge, ...statusStyle(ticket.statut) }}>
                    {ticket.statut}
                  </span>
                }
              />
              <Info
                label="Priorité"
                value={
                  <span style={{ ...styles.badge, ...priorityStyle(ticket.priorite) }}>
                    {ticket.priorite}
                  </span>
                }
              />
            </div>
          </div>

          {/* Description */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Description de l’incident</h3>
            <p style={styles.text}>{ticket.description}</p>
          </div>

          {/* Commentaires */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Commentaires / Historique</h3>

            {commentaires.map(c => (
              <div key={c.id} style={styles.comment}>
                <div style={styles.avatar}>{c.auteur[0]}</div>

                <div>
                  <div style={styles.commentHeader}>
                    <strong>{c.auteur}</strong>
                    <span style={styles.date}>
                      {new Date(c.dateCreation).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p>{c.contenu}</p>
                </div>
              </div>
            ))}

            <textarea
              style={styles.textarea}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />

            <button style={styles.button} onClick={envoyerCommentaire}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* 🔹 Composant info */
const Info = ({ label, value }) => (
  <div>
    <div style={styles.label}>{label}</div>
    <div>{value}</div>
  </div>
);

/* 🎨 Styles dynamiques */
const statusStyle = statut => ({
  background:
    statut === "En cours" ? "#dbeafe" :
    statut === "Résolu" ? "#dcfce7" :
    "#fef3c7",
  color:
    statut === "En cours" ? "#1d4ed8" :
    statut === "Résolu" ? "#166534" :
    "#92400e"
});

const priorityStyle = p => ({
  background:
    p === "Haute" ? "#fee2e2" :
    p === "Moyenne" ? "#fef3c7" :
    "#dcfce7",
  color:
    p === "Haute" ? "#991b1b" :
    p === "Moyenne" ? "#92400e" :
    "#166534"
});

/* 🎨 Styles globaux */
const styles = {
  page: {
    marginLeft: 260,
    minHeight: "100vh",
    background: "#f3f4f6"
  },
  container: {
    padding: 30,
    maxWidth: 1100
  },
  back: {
    display: "inline-block",
    marginBottom: 20,
    color: "#2563eb",
    textDecoration: "none"
  },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  title: {
    margin: 0
  },
  sectionTitle: {
    marginBottom: 15
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 20
  },
  label: {
    fontSize: 13,
    color: "#6b7280"
  },
  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600
  },
  text: {
    lineHeight: 1.6
  },
  comment: {
    display: "flex",
    gap: 12,
    paddingBottom: 15,
    borderBottom: "1px solid #e5e7eb",
    marginBottom: 15
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  commentHeader: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },
  date: {
    fontSize: 12,
    color: "#6b7280"
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    marginTop: 10
  },
  button: {
    marginTop: 10,
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  loading: {
    marginLeft: 260,
    padding: 60
  }
};
