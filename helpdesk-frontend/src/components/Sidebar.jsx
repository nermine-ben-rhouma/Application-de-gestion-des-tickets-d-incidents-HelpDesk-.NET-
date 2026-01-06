// components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const role = user.role || user.Role || "Employé";
  const userName = user.name || user.nom || "Utilisateur"; // ajuste selon ton objet user

  // Mapping des rôles pour afficher en français comme dans la photo
  const roleDisplay = {
    admin: "Administrateur",
    technicien: "Technicien",
    employe: "Employé",
  }[role.toLowerCase()] || "Employé";

  const menuItems = {
    admin: [
      { to: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
      { to: "/admin/users", icon: "👥", label: "Utilisateurs" },
      { to: "/admin/tickets", icon: "🎫", label: "Tickets" },
      { to: "/admin/stats", icon: "📊", label: "Historique / Statistiques" },
      { to: "/admin/settings", icon: "⚙️", label: "Paramètres" },
    ],
    technicien: [
      { to: "/technician/dashboard", icon: "🏠", label: "Dashboard" },
      { to: "/technician/tickets", icon: "🎫", label: "Historique Tickets " },
    ],
    employe: [
      { to: "/user/tickets", icon: "🎫", label: "Mes tickets" },
      { to: "/user/new-ticket", icon: "➕", label: "Nouveau ticket" },
    ],
  };

  const items = menuItems[role.toLowerCase()] || menuItems.employe;

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* En-tête avec logo */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #f3f4f6",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(to bottom, #6366f1, #8b5cf6)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "22px",
            }}
          >
            📄
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
              HelpDesk .NET
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
              {roleDisplay} · {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ padding: "0 16px", flex: 1 }}>
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 16px",
              marginBottom: "8px",
              borderRadius: "12px",
              textDecoration: "none",
              backgroundColor: isActive(item.to) ? "#e0e7ff" : "transparent",
              color: isActive(item.to) ? "#4f46e5" : "#6b7280",
              fontWeight: isActive(item.to) ? "600" : "500",
              fontSize: "16px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              !isActive(item.to) && (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              !isActive(item.to) && (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}