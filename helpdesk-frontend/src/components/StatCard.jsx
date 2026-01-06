export default function StatCard({ title, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        width: "240px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          background: color || "#e3e8ff",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        {icon}
      </div>

      <div>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{title}</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "28px", color: "#2c3e50" }}>
          {value}
        </h3>
      </div>
    </div>
  );
}