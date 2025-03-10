import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos el tipo de datos que manejará el contexto
interface EventContextType {
  selectedMap: { label: string; selected: number }[];
  setSelectedMap: (selected: { label: string; selected: number }[]) => void;
}

// Creamos el contexto
const EventContext = createContext<EventContextType | undefined>(undefined);

// Proveedor del contexto
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMap, setSelectedMap] = useState<{ label: string; selected: number }[]>([]);

  return (
    <EventContext.Provider value={{ selectedMap, setSelectedMap }}>
      {children}
    </EventContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvent debe usarse dentro de un EventProvider');
  return context;
};

// Asegúrate de exportarlo correctamente
export default EventContext;