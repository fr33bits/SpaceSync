import { useEffect, useState } from "react"
import { durationHHMM, getFormattedDatetimeFromUNIX } from "../functions/datetime"
import { getReservations, Reservation } from "../functions/reservations"
import '../styles/ReservationTable.css'

import { Notice } from "./Notice"
import { useView } from "../contexts/ViewContext"
import { useReservation } from "../contexts/ReservationContext"

export const ReservationTable: React.FC = () => {
    // COMPONENT STATES
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [notice, setNotice] = useState<string | null>(null);

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
                setNotice("")
            } catch (err: any) {
                setNotice(err.response?.data.noticeCode || err.code || err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [])


    if (notice) {
        return (
            <Notice notice={notice}/>
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
                    <th scope="col">Created at</th>
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
                            {getFormattedDatetimeFromUNIX(reservation.start, 'local', true)}
                        </td>
                        <td>
                            {getFormattedDatetimeFromUNIX(reservation.end, 'local', true)}
                        </td>
                        <td>
                            {durationHHMM(reservation.end - reservation.start)}
                        </td>
                        {reservation.created_at ?
                            <td>
                                {getFormattedDatetimeFromUNIX(reservation.created_at, 'local', true)}
                                <span className="updated">
                                    {reservation.last_modified_at ?
                                        ` Last updated: ${getFormattedDatetimeFromUNIX(reservation.last_modified_at, 'local', true)}`
                                        : null
                                    }
                                </span>
                            </td> : null
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    )
}