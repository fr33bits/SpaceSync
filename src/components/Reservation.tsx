import React, { useEffect, useState } from "react"
import { durationFromFormatted, durationHHMM } from '../functions/datetime'

import { Notice } from "./Notice.tsx"
import { useReservation } from "../contexts/ReservationContext.tsx"
import '../styles/Reservation.css'

export const Reservation: React.FC = () => {
    // STATES
    const [duration, setDuration] = useState<string>()

    // CONTEXT STATES
    const reservationContext = useReservation()
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

    useEffect(() => {
        if (startDatetime && endDatetime) {
            const durationSec: number = durationFromFormatted(startDatetime, endDatetime)
            setDuration(durationHHMM(durationSec))
        }
    }, [startDatetime, endDatetime])

    if (reservationError === 'ERR_NETWORK' || reservationError === 'reservation-fetch-failed') {
        return (<div>{reservationError ? <Notice notice={reservationError}/> : null}</div>)
    }

    return (
        <div className="reservation">
            <div className="reservation-form">
                <div className="reservation-form-title">
                    <label htmlFor="title">Title</label><br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        minLength={1}
                        maxLength={300}
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <div className="reservation-form-duration-item">
                        <label htmlFor="datetime-start">Start date and time</label><br/>
                        <input
                            type="datetime-local"
                            id="datetime-start"
                            name="datetime-start"
                            value={startDatetime}
                            onChange={(e) => { setStartDatetime(e.target.value) }}
                        />
                    </div>
                    <div className="reservation-form-duration-item">
                        <label htmlFor="datetime-end">End date and time</label><br />
                        <input
                            type="datetime-local"
                            id="datetime-start"
                            name="datetime-start"
                            value={endDatetime}
                            onChange={(e) => setEndDatetime(e.target.value)}
                        />
                    </div>
                    {duration ?
                        <div className="reservation-form-duration-item">
                            Duration: {duration}
                        </div> : null
                    }
                </div>
                <br/>
                <p>Please note that the date and time selected are in your local time (as reported by the browser) however they are saved into the database with the timezone data in order to ensure consistency between timezones</p>
            </div>
            {reservationError ? <Notice notice={reservationError}/> : null}
        </div>
    )
}