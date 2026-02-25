import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { apiFetch } from "../api/client";
import ReservationModal from "../components/ReservationModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);

  // Estados para controlar el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [modalError, setModalError] = useState("");

  async function load() {
    try {
      const sp = await apiFetch("/spaces");
      const rs = await apiFetch("/reservations");

      setSpaces(sp);

      setEvents(
        rs.map((r) => ({
          id: r.id,
          title: r.title || `${r.space_name} - ${r.user_name}`,
          start: r.start_time,
          end: r.end_time,
        }))
      );
    } catch (e) {
      console.error("Error al cargar datos:", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // 1. Cuando el usuario selecciona un rango en el calendario
  function handleSelect(info) {
    if (!spaces.length) {
      alert("No hay espacios creados.");
      return;
    }
    
    // Guardamos las fechas seleccionadas y abrimos el modal
    setSelectedRange(info);
    setModalError("");
    setIsModalOpen(true);
  }

  // 2. Cuando el usuario da clic en "Confirmar" dentro del Modal
  async function handleConfirmReservation(space_id) {
    setModalError(""); // Limpiamos errores previos

    try {
      await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify({
          space_id: Number(space_id),
          start_time: selectedRange.startStr,
          end_time: selectedRange.endStr,
        }),
      });

      // Si tiene éxito: recargamos eventos, cerramos modal y quitamos la selección
      await load();
      setIsModalOpen(false);
      selectedRange.view.calendar.unselect();
      
    } catch (e) {
      // Si hay conflicto (traslape), mostramos el mensaje del backend en el modal
      setModalError(e.message);
    }
  }

  // 3. Eliminar reserva (Por ahora mantenemos el confirm nativo, luego lo mejoramos)
  async function handleEventClick(info) {
    if (!confirm("¿Eliminar reserva?")) return;

    try {
      await apiFetch(`/reservations/${info.event.id}`, {
        method: "DELETE",
      });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto" }}>
      <h1 className="text-4xl font-bold text-blue-500 mb-6 text-center">Calendario</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleSelect}
        eventClick={handleEventClick}
        events={events}
      />

      {/* Aquí insertamos nuestro componente Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReservation}
        spaces={spaces}
        errorMessage={modalError}
      />
    </div>
  );
}