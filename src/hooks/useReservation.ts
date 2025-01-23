import { useContext } from 'react';
import { ReservationContext } from '../contexts/ReservationContext.ts';

export const useReservation = () => useContext(ReservationContext);