import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RoleBadge from "../../components/RoleBadge";
import api from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal ajout/édition
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    roleId: 3
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    api.get("/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement utilisateurs :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.nom || ""} ${user.prenom || ""} ${user.email || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const openAddModal = () => {
    setIsEdit(false);
    setCurrentUser(null);
    setFormData({ nom: "", prenom: "", email: "", motDePasse: "", roleId: 3 });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setCurrentUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      motDePasse: "",
      roleId: user.roleId || getRoleIdFromName(user.role),
    });
    setFormError("");
    setShowModal(true);
  };

  const getRoleIdFromName = (roleName) => {
    const map = {
      "Administrateur": 1,
      "Technicien": 2,
      "Employé": 3,
    };
    return map[roleName] || 3;
  };

  const handleSave = () => {
    if (!formData.nom || !formData.prenom || !formData.email) {
      setFormError("Nom, Prénom et Email sont obligatoires");
      return;
    }
    if (!isEdit && !formData.motDePasse) {
      setFormError("Mot de passe obligatoire pour un nouvel utilisateur");
      return;
    }

    setSaving(true);

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      roleId: formData.roleId,
    };
    if (!isEdit) payload.motDePasse = formData.motDePasse;

    const request = isEdit
      ? api.put(`/users/${currentUser.id}`, payload)
      : api.post("/users", payload);

    request
      .then(() => {
        loadUsers();
        setShowModal(false);
        setSaving(false);
      })
      .catch((err) => {
        console.error("Erreur sauvegarde :", err);
        setFormError(
          err.response?.data?.title || "Erreur lors de l'enregistrement"
        );
        setSaving(false);
      });
  };

  // Suppression avec modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);

    try {
      await api.delete(`/users/${userToDelete.id}`);
      loadUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setDeleting(false);
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
            Gestion des Utilisateurs
          </h1>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <button onClick={openAddModal} style={{
              background: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}>
              + Nouvel utilisateur
            </button>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "12px 50px 12px 20px",
                  width: "400px",
                  borderRadius: "50px",
                  border: "1px solid #ddd"
                }}
              />
              <span style={{ position: "absolute", right: "20px", top: "12px", color: "#3b82f6" }}>🔍</span>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 20px", color: "#4a5568" }}>Liste des utilisateurs</h3>

            {loading ? (
              <p style={{ textAlign: "center", padding: "40px" }}>Chargement...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                    <th style={{ padding: "15px" }}>NOM</th>
                    <th style={{ padding: "15px" }}>PRÉNOM</th>
                    <th style={{ padding: "15px" }}>EMAIL</th>
                    <th style={{ padding: "15px" }}>RÔLE</th>
                    <th style={{ padding: "15px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px" }}>{user.nom}</td>
                      <td style={{ padding: "15px" }}>{user.prenom}</td>
                      <td style={{ padding: "15px" }}>{user.email}</td>
                      <td style={{ padding: "15px" }}>
                        <RoleBadge role={user.role} />
                      </td>
                      <td style={{ padding: "15px", display: "flex", gap: "16px", alignItems: "center" }}>
                        <button 
                          onClick={() => openEditModal(user)} 
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#ef4444" }}
                          title="Supprimer"
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

      {/* Modal Ajout/Édition */}
      {showModal && (
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
            width: "500px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "24px" }}>
              {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h2>

            {formError && <p style={{ color: "red", marginBottom: "10px" }}>{formError}</p>}

            <label>Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <label>Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
            />

            {!isEdit && (
              <>
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                  placeholder="Obligatoire pour un nouvel utilisateur"
                  style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </>
            )}

            <label>Rôle</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
              style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}
            >
              <option value={3}>Employé</option>
              <option value={2}>Technicien</option>
              <option value={1}>Administrateur</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteModal && userToDelete && (
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
            width: "450px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", color: "#ef4444", marginBottom: "20px" }}>
              ⚠️
            </div>
            <h2 style={{ margin: "0 0 15px", fontSize: "22px" }}>
              Supprimer l'utilisateur ?
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
              Êtes-vous sûr de vouloir supprimer <strong>{userToDelete.prenom} {userToDelete.nom}</strong> ({userToDelete.email}) ?<br />
              Cette action est <strong>irréversible</strong>.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                disabled={deleting}
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