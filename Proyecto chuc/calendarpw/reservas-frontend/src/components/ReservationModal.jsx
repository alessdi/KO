import React, { useState } from 'react';

const ReservationModal = ({ isOpen, onClose, onConfirm, spaces, errorMessage }) => {
  const [selectedSpace, setSelectedSpace] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedSpace) return;
    onConfirm(selectedSpace);
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
      
      // Contenedor blanco del Modal
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4 transform transition-all">
        
        <h2 className="text-2xl font-bold text-gray-800">Nueva Reserva</h2>
        <p className="text-gray-600">Selecciona el espacio que deseas reservar:</p>
        
        <select 
          value={selectedSpace} 
          onChange={(e) => setSelectedSpace(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="" disabled>-- Elige un espacio --</option>
          {spaces.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>

        {/* Mensaje de error (si hay traslape) */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={!selectedSpace} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium shadow-sm transition-colors"
          >
            Confirmar Reserva
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReservationModal;