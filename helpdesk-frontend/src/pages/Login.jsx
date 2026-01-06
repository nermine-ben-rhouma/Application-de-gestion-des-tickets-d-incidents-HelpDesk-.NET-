import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Veuillez remplir l'email et le mot de passe");
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email: email.trim(), password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Redirection selon le rôle
      if (user.role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (user.role === "employe") navigate("/user/tickets", { replace: true });
      else if (user.role === "technicien") navigate("/technician/dashboard", { replace: true });
      else setError("Rôle utilisateur inconnu");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #6366f1, #a78bfa)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        {/* Logo (remplace par ton vrai logo si tu as un <img>) */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(to bottom, #6366f1, #8b5cf6)",
            borderRadius: "20px",
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          📄
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
          HelpDesk .NET
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Système de gestion des tickets
        </p>

        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "32px" }}>
          Connexion
        </h2>

        {error && (
          <p style={{ color: "#ef4444", marginBottom: "16px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "20px",
                }}
              >
                @
              </span>
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 48px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "20px",
                }}
              >
                🔒
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 48px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(to right, #3b82f6, #6366f1)",
              color: "white",
              fontWeight: "600",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        
         
      </div>
    </div>
  );
}