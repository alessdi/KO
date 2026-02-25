import { Link } from "react-router-dom";
import { apiFetch } from "../api/client"; // Asegúrate de que la ruta sea correcta

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Misión: Logout Seguro e integral
  async function logout() {
    try {
      // 1. Notificamos al backend para destruir el token en la DB
      await apiFetch("/logout", { method: "POST" });
    } catch (e) {
      console.error("Error al cerrar sesión en el servidor:", e);
    } finally {
      // 2. Limpiamos el almacenamiento local pase lo que pase
      localStorage.clear();
      // 3. Redirigimos al inicio (login)
      window.location.href = "/";
    }
  }

  // Si no hay token, no mostramos la barra (para la pantalla de Login)
  if (!token) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-6">
        {/* Branding o Logo simple */}
        <span className="text-xl font-bold text-blue-600 mr-4">ReservasApp</span>
        
        <Link 
          to="/calendar" 
          className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Calendario
        </Link>

        {/* Solo el Admin ve el acceso a Espacios */}
        {role === "admin" && (
          <Link 
            to="/admin/spaces" 
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Espacios
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Badge de rol para saber quién está logueado */}
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">
          {role}
        </span>
        
        <button 
          onClick={logout}
          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-red-200"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}