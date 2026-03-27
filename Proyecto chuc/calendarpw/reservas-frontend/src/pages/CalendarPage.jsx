import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReservationModal from "../components/ReservationModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [modalError, setModalError] = useState("");

  const BASE_URL = "http://127.0.0.1:8001/api";

  async function load() {
    try {
      const resSp = await fetch(`${BASE_URL}/spaces`);
      const sp = await resSp.json();
      
      const resRs = await fetch(`${BASE_URL}/reservas`);
      const rs = await resRs.json();

      setSpaces(sp);
      setEvents(rs.map((r) => ({
        id: r.id,
        title: r.title || `${r.space_name || 'Sala'} - ${r.user_name || 'Usuario'}`,
        start: r.start_time,
        end: r.end_time,
      })));
    } catch (e) {
      console.error("Error al cargar datos:", e);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSelect(info) {
    if (!spaces.length) {
      alert("No hay espacios creados.");
      return;
    }
    setSelectedRange(info);
    setModalError("");
    setIsModalOpen(true);
  }

  async function handleConfirmReservation(space_id) {
    setModalError(""); 
    try {
      const resp = await fetch(`${BASE_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          space_id: Number(space_id),
          start_time: selectedRange.startStr,
          end_time: selectedRange.endStr,
        }),
      });
      if (!resp.ok) throw new Error("Error al guardar");
      await load();
      setIsModalOpen(false);
    } catch (e) {
      setModalError(e.message);
    }
  }

  async function handleEventClick(info) {
    if (!confirm("¿Eliminar reserva?")) return;
    try {
      await fetch(`${BASE_URL}/reservas/${info.event.id}`, { method: "DELETE" });
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