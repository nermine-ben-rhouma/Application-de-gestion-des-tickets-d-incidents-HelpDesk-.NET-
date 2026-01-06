import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function NewTicket() {
  const navigate = useNavigate();

  // Récupérer l'ID du createur depuis localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const createurId = user.id || 0;
  const userName = `${user.prenom || ""} ${user.nom || ""}`.trim() || "Employé";

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [statutId, setStatutId] = useState(1); // "Nouveau"
  const [prioriteId, setPrioriteId] = useState(1); // "Basse"
  const [technicienId, setTechnicienId] = useState(""); // facultatif
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!titre.trim()) return setError("Le titre est obligatoire.");
    if (!description.trim()) return setError("La description est obligatoire.");

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("Titre", titre.trim());
      formData.append("Description", description.trim());
      formData.append("StatutId", statutId);        // Obligatoire pour le backend
      formData.append("PrioriteId", prioriteId);    // Obligatoire
      formData.append("CreateurId", createurId);   // Obligatoire
      if (technicienId) formData.append("TechnicienId", technicienId);
      if (fichier) formData.append("Fichier", fichier, fichier.name);

      await api.post("/Tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTitre("");
      setDescription("");
      setStatutId(1);
      setPrioriteId(1);
      setTechnicienId("");
      setFichier(null);

      setTimeout(() => navigate("/user/tickets"), 1500);
    } catch (err) {
      console.error("Erreur création ticket :", err.response?.data || err);
      const msg = err.response?.data?.title || "Erreur lors de la création du ticket.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}><Sidebar /></div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "30px" }}>
            Nouveau Ticket
          </h1>
          <p>Employé : <strong>{userName}</strong></p>

          {error && <div style={{ color: "#b91c1c", marginBottom: "20px" }}>⚠️ {error}</div>}
          {success && <div style={{ color: "#065f46", marginBottom: "20px" }}>✅ Ticket créé avec succès !</div>}

          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "20px" }}>
              <label>Titre</label>
              <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Statut</label>
              <select value={statutId} onChange={(e) => setStatutId(Number(e.target.value))} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}>
                <option value={1}>Nouveau</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Priorité</label>
              <select value={prioriteId} onChange={(e) => setPrioriteId(Number(e.target.value))} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}>
                <option value={1}>Basse</option>
                <option value={2}>Moyenne</option>
                <option value={3}>Haute</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Technicien (facultatif)</label>
              <input type="number" value={technicienId} onChange={(e) => setTechnicienId(e.target.value)} placeholder="ID du technicien" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label>Fichier (facultatif)</label>
              <input type="file" onChange={(e) => setFichier(e.target.files[0])} />
              {fichier && <p>{fichier.name}</p>}
            </div>

            <button type="submit" disabled={loading} style={{ background: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
              {loading ? "Création..." : "Créer le ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
