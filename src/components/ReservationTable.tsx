import { useEffect, useState } from "react"
import { getFormattedDatetimeFromUNIX } from "../functions/datetime"
import { getReservations, Reservation } from "../functions/reservations"
import '../styles/ReservationTable.css'

interface ReservationTableProps {
    setSelectedReservation: (reservation_id: number | null) => void
}

export const ReservationTable: React.FC<ReservationTableProps> = ({setSelectedReservation}) => {
    const [reservations, setReservations]: any = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    } else if (error) {
        return (
            <div>
                Error: {error}
            </div>
        )
    } else {
        return (
            <table className="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Start</th>
                        <th scope="col">End</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations?.map((reservation: Reservation) => (
                        <tr key={reservation.id} onClick={() => {setSelectedReservation(reservation.id)}}>
                            <th scope="row">
                                {reservation.id}
                            </th>
                            <th scope="row">
                                {reservation.title}
                            </th>
                            <td>
                                {getFormattedDatetimeFromUNIX(reservation.start)}
                            </td>
                            <td>
                                {getFormattedDatetimeFromUNIX(reservation.end)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}