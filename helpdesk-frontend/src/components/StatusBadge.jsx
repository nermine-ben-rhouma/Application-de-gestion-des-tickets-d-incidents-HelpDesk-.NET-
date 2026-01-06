export default function StatusBadge({ statut }) {
  const styles = {
    NOUVEAU: { background: "#e0edff", color: "#2563eb" },
    EN_COURS: { background: "#fff7ed", color: "#ea580c" },
    RESOLU: { background: "#dcfce7", color: "#16a34a" },
  };

  return (
    <span
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        ...styles[statut],
      }}
    >
      {statut.replace("_", " ")}
    </span>
  );
}
