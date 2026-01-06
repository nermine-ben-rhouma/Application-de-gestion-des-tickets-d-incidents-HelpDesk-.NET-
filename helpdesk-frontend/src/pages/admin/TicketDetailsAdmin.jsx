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
      .then(([t, c]) => {
        setTicket(t.data);
        setCommentaires(c.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const envoyerCommentaire = async () => {
    if (!newComment.trim()) return;

    await api.post("/Commentaire", {
      contenu: newComment,
      ticketId: id,
      userId: JSON.parse(localStorage.getItem("user")).id
    });

    setNewComment("");
    const res = await api.get(`/Commentaire/ticket/${id}`);
    setCommentaires(res.data);
  };

  if (loading) return <p>Chargement...</p>;
  if (!ticket) return <p>Ticket introuvable</p>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: 260 }}>
        <Navbar />

        <div style={{ padding: 30 }}>
          {/* 🔴 CORRECTION ICI */}
          <Link to="/tickets">← Retour à la liste</Link>

          <h1>{ticket.titre}</h1>

          <p><strong>Statut :</strong> {ticket.statut}</p>
          <p><strong>Priorité :</strong> {ticket.priorite}</p>
          <p><strong>Description :</strong> {ticket.description}</p>

          <h3>Commentaires</h3>

          {commentaires.map(c => (
            <div key={c.id}>
              <strong>{c.auteur}</strong> —{" "}
              {new Date(c.dateCreation).toLocaleDateString("fr-FR")}
              <p>{c.contenu}</p>
            </div>
          ))}

          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />

          <button onClick={envoyerCommentaire}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
