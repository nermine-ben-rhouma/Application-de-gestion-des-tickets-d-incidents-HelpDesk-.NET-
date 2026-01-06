export default function RoleBadge({ role }) {
  const styles = {
    Administrateur: { background: "#f3e8ff", color: "#a855f7" },  // بنفسجي
    Technicien: { background: "#dbf4ff", color: "#1e88e5" },       // أزرق
    Employé: { background: "#e0f7fa", color: "#006064" },          // سيان
  };

  const style = styles[role] || { background: "#e0e0e0", color: "#424242" };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold",
        ...style,
      }}
    >
      {role === "Administrateur" ? "Admin" : role}
    </span>
  );
}