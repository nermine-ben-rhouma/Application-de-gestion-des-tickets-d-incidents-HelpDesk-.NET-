import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function NewTicket() {
  const navigate = useNavigate();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [statutId, setStatutId] = useState(1);
  const [prioriteId, setPrioriteId] = useState(1);
  const [technicienId, setTechnicienId] = useState(""); // facultatif
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupérer l'ID du createur depuis localStorage
  const storedUser = localStorage.getItem("user");
  const createurId = storedUser ? JSON.parse(storedUser).id : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Titre", titre);
      formData.append("Description", description);
      formData.append("StatutId", statutId);
      formData.append("PrioriteId", prioriteId);
      formData.append("CreateurId", createurId);
      if (technicienId) formData.append("TechnicienId", technicienId);
      if (fichier) formData.append("Fichier", fichier);

      await api.post("/Tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ticket créé avec succès !");
      navigate("/admin/tickets");
    } catch (err) {
      console.error("Erreur création ticket :", err);
      alert("Erreur lors de la création du ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "30px" }}>
            Nouveau Ticket
          </h1>

          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "20px" }}>
              <label>Titre</label>
              <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Statut</label>
              <select value={statutId} onChange={(e) => setStatutId(Number(e.target.value))} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}>
                <option value={1}>Nouveau</option>
                <option value={2}>En cours</option>
                <option value={3}>Résolu</option>
                <option value={4}>Fermé</option>
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
              <input
                type="number"
                value={technicienId}
                onChange={(e) => setTechnicienId(e.target.value)}
                placeholder="ID du technicien"
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label>Fichier (facultatif)</label>
              <input type="file" onChange={(e) => setFichier(e.target.files[0])} />
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
