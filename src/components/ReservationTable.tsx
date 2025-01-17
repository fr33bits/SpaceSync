import { useEffect, useState } from "react"
import { getFormattedDatetimeFromUNIX } from "../functions/datetime"
import { getReservations, Reservation } from "../functions/reservations"

export const ReservationTable = () => {
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
            <table>
                {reservations?.map((reservation: Reservation) => (
                    <div key={reservation.id}>
                        <div>
                            {reservation.title}
                        </div>
                        <div>
                            {getFormattedDatetimeFromUNIX(reservation.start)}
                        </div>
                        <div>
                            {getFormattedDatetimeFromUNIX(reservation.end)}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}