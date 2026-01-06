import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      {/* الـ Sidebar دائمًا على اليسار في كل الصفحات */}
      <Sidebar />

      {/* المحتوى الرئيسي */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "40px" }}>
          {children}  {/* هنا هيظهر محتوى الصفحة (Dashboard أو Users أو غيره) */}
        </div>
      </div>
    </div>
  );
}