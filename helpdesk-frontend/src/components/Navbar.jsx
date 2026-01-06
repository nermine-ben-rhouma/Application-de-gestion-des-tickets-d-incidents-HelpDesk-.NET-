// أو استخدم الطريقة المباشرة تحت

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  // تحويل الرتبة للعرض الجميل زي الماكيت
  const getRoleLabel = (role) => {
    switch (role) {
      case "Administrateur":
        return "Admin";
      case "Technicien":
        return "Technicien";
      case "Employé":
        return "Employé";
      default:
        return role;
    }
  };

  // دالة Logout نظيفة
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // إذا كان عندك logout في authService يقوم بحاجة إضافية، استخدمه
    // logout();
    window.location.href = "/"; // رجوع لصفحة الـ Login
  };

  if (!user) return null; // أمان إضافي

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#ffffff",
        borderBottom: "1px solid #eee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* الجانب الأيسر: اللوغو والاسم */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div
          style={{
            width: "45px",
            height: "45px",
            background: "#5e6cff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          HD
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#2c3e50" }}>
            HelpDesk .NET
          </h2>
          <small style={{ color: "#95a5a6" }}>Système de gestion des tickets</small>
        </div>
      </div>

      {/* الجانب الأيمن: اسم المستخدم + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontSize: "16px", color: "#34495e" }}>
          <strong>{getRoleLabel(user.role)}</strong> : {user.prenom} {user.nom}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.background = "#c0392b")}
          onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}