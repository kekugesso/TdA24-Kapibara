// context/ReservationsContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";
import { _reservation } from "@/components/basic/lecturer";

interface ReservationsContextProps {
  reservations: _reservation[];
  deleteReservation: (uuid: string) => void;
  addReservation: (reservation: _reservation) => void;
}

const ReservationsContext = createContext<ReservationsContextProps | undefined>(undefined);

export const ReservationsProvider = ({ children, initialReservations }: { children: ReactNode, initialReservations: _reservation[] }) => {
  const [reservations, setReservations] = useState<_reservation[]>(initialReservations);

  const deleteReservation = async (uuid: string) => {
    const response = await fetch(`/api/reservation/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete reservation');
    }
    setReservations(prev => prev.filter(reservation => reservation.uuid !== uuid));
  };

  const addReservation = async (reservation: _reservation) => {
    const response = await fetch('/api/reservationtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) {
      throw new Error('Failed to create reservation');
    }
    const body = await response.json();
    const newReservation = new _reservation(
      body.uuid,
      body.start_time,
      body.end_time,
      body.student,
      body.location,
      body.status,
      body.description,
      body.subject,
    );
    setReservations(prev => [...prev, newReservation]);
  };

  return (
    <ReservationsContext.Provider value={{ reservations, deleteReservation, addReservation }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error("useReservations must be used within a ReservationsProvider");
  }
  return context;
};

