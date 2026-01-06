import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function Settings() {
  const [settings, setSettings] = useState({
    systemName: "HelpDesk .NET",
    supportEmail: "support@helpdesk.net",
    responseTimeHours: 24,
    allowUserRegistration: true,
    requireTicketApproval: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      // Simulation de sauvegarde (remplace par un vrai appel API quand tu l'auras)
      console.log("Paramètres sauvegardés :", settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Message disparaît après 3s
    } catch (err) {
      console.error("Erreur sauvegarde :", err);
      setError("Erreur lors de la sauvegarde des paramètres");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", color: "#2c3e50", marginBottom: "10px" }}>
            Paramètres
          </h1>
          <p style={{ color: "#666", marginBottom: "40px" }}>
            Configurez les paramètres généraux du système HelpDesk
          </p>

          {success && (
            <p style={{ color: "green", fontWeight: "bold", marginBottom: "20px" }}>
              Paramètres sauvegardés avec succès !
            </p>
          )}
          {error && (
            <p style={{ color: "red", fontWeight: "bold", marginBottom: "20px" }}>
              {error}
            </p>
          )}

          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "22px", color: "#2c3e50", marginBottom: "30px" }}>
              Configuration générale
            </h2>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Nom du système
              </label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => handleChange("systemName", e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Email de support
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                Délai de réponse attendu (en heures)
              </label>
              <input
                type="number"
                value={settings.responseTimeHours}
                onChange={(e) => handleChange("responseTimeHours", Number(e.target.value))}
                min="1"
                style={{ width: "200px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            <h2 style={{ fontSize: "22px", color: "#2c3e50", margin: "40px 0 30px" }}>
              Fonctionnalités
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistration}
                  onChange={(e) => handleChange("allowUserRegistration", e.target.checked)}
                  style={{ width: "20px", height: "20px" }}
                />
                Autoriser l'inscription des nouveaux utilisateurs
              </label>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.requireTicketApproval}
                  onChange={(e) => handleChange("requireTicketApproval", e.target.checked)}
                  style={{ width: "20px", height: "20px" }}
                />
                Exiger l'approbation des tickets par un admin avant assignation
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "14px 32px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}