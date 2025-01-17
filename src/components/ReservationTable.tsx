import { useEffect, useState } from "react"
import { durationHHMM, getFormattedDatetimeFromUNIX } from "../functions/datetime"
import { getReservations, Reservation } from "../functions/reservations"
import '../styles/ReservationTable.css'

import { useView } from "../contexts/ViewContext"
import { useReservation } from "../contexts/ReservationContext"

export const ReservationTable: React.FC = () => {
    // COMPONENT STATES
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null);

    // CONTEXT STATES
    const viewContext = useView()
    const setSelectedView = viewContext?.setSelectedView
    const reservationContext = useReservation()
    const setSelectedReservation = reservationContext?.setSelectedReservation
    if (!setSelectedView) {
        throw new Error("setSelectedView is undefined")
    }
    if (!setSelectedReservation) {
        throw new Error("setSelectedView is undefined")
    }

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data: Reservation[] = await getReservations()
                setReservations(data)
                setLoading(false)
            } catch (err: any) {
                setError(err.message || "Failed to fetch reservations")
                setLoading(false)
            }
        }
        fetchReservations()
    }, [])


    if (error) {
        return (
            <div>
                ERROR: {error}
            </div>
        )
    }
    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <table className="table table-hover table-dark">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                    <th scope="col">Duration</th>
                </tr>
            </thead>
            <tbody>
                {reservations?.map((reservation: Reservation) => (
                    <tr key={reservation.id} onClick={() => { setSelectedReservation(reservation.id); setSelectedView('reservation-existing') }}>
                        <th scope="row">
                            {reservation.id}
                        </th>
                        <th scope="row">
                            {reservation.title}
                        </th>
                        <td>
                            {getFormattedDatetimeFromUNIX(reservation.start, 'local')}
                        </td>
                        <td>
                            {getFormattedDatetimeFromUNIX(reservation.end, 'local')}
                        </td>
                        <td>
                            {durationHHMM(reservation.end - reservation.start)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}