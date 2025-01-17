import React from "react"
import { getCurrentDatetime, convertToLocalTime } from '../functions/datetime'
import { getErrorMessage } from '../functions/common.ts'

import { useReservation } from "../contexts/ReservationContext.tsx"
import '../styles/Reservation.css'

export const Reservation: React.FC = () => {
    // CONTEXT STATES
    const reservationContext = useReservation()
    const selectedReservation = reservationContext?.selectedReservation
    const title = reservationContext?.title
    const setTitle = reservationContext?.setTitle
    const startDatetime = reservationContext?.startDatetime
    const setStartDatetime = reservationContext?.setStartDatetime
    const endDatetime = reservationContext?.endDatetime
    const setEndDatetime = reservationContext?.setEndDatetime
    const loading = reservationContext?.loading
    const reservationError = reservationContext?.error
    if (!setTitle) {
        throw new Error("setTitle is undefined")
    }
    if (!setStartDatetime) {
        throw new Error("setStartDatetime is undefined")
    }
    if (!setEndDatetime) {
        throw new Error("setEndDatetime is undefined")
    }

    if (loading) {
        return (<div>Loading...</div>)
    }

    return (
        <div>
            <form>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" minLength={1} maxLength={300} value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <p>Please note that the date and time selected are in your local time (as reported by the browser) however they are saved into the database with the timezone data in order to ensure consistency between timezones</p>
                <div>
                    <label htmlFor="datetime-start">Start date and time</label>
                    <input
                        type="datetime-local"
                        id="datetime-start"
                        name="datetime-start"
                        value={startDatetime}
                        min={selectedReservation ? "" : convertToLocalTime(getCurrentDatetime())}
                        onChange={(e) => {
                            setStartDatetime(e.target.value)
                            endDatetime && startDatetime && endDatetime < startDatetime ? setEndDatetime(e.target.value) : null // endDatetime && startDatetime needed to ensure they are not undefined
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="datetime-end">End date and time</label>
                    <input
                        type="datetime-local"
                        id="datetime-start"
                        name="datetime-start"
                        value={endDatetime}
                        min={startDatetime}
                        onChange={(e) => setEndDatetime(e.target.value)}
                    />
                </div>
            </form>
            {reservationError ?
                <div className="error">
                    <span className="error-icon material-symbols-outlined">
error
</span>
                    {getErrorMessage(reservationError, true, 'EN')}
                </div> : null
            }
        </div>
    )
}