import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Stats from "./pages/admin/Stats";
import TicketsAdmin from "./pages/admin/Tickets";
import Settings from "./pages/admin/Settings";
import NewTicketAdmin from "./pages/admin/NewTicket";
import TicketDetailsAdmin from "./pages/admin/NewTicket";


// Employé
import MyTickets from "./pages/user/MyTickets";
import NewTicket from "./pages/user/NewTicket";
import TicketDetailUser from "./pages/user/TicketDetail";

// Technicien
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianTickets from "./pages/technician/TechnicianTickets";
import TicketDetails from "./pages/technician/TicketDetails";

// Utils
const getCurrentUserRole = () => {
  const user = localStorage.getItem("user");
  if (!user) return "";
  try {
    return JSON.parse(user).role.toLowerCase().trim();
  } catch {
    return "";
  }
};

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = getCurrentUserRole();

  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={["admin"]}><Stats /></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={["admin"]}><TicketsAdmin /></ProtectedRoute>} />
        <Route path="/admin/new-ticket" element={<ProtectedRoute allowedRoles={["admin"]}><NewTicketAdmin /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>} />
        <Route path="/admin/tickets/:id" element={<TicketDetailsAdmin />} />


        {/* Employé */}
        <Route path="/user/tickets" element={<ProtectedRoute allowedRoles={["employe"]}><MyTickets /></ProtectedRoute>} />
        <Route path="/user/new-ticket" element={<ProtectedRoute allowedRoles={["employe"]}><NewTicket /></ProtectedRoute>} />
        <Route path="/user/tickets/:id" element={<ProtectedRoute allowedRoles={["employe"]}><TicketDetailUser /></ProtectedRoute>} />

        {/* Technicien */}
        <Route path="/technician/dashboard" element={<ProtectedRoute allowedRoles={["technicien"]}><TechnicianDashboard /></ProtectedRoute>} />
        <Route path="/technician/tickets" element={<ProtectedRoute allowedRoles={["technicien"]}><TechnicianTickets /></ProtectedRoute>} />
        <Route path="/technician/tickets/:id" element={<ProtectedRoute allowedRoles={["technicien"]}><TicketDetails /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
