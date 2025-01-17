import React, { useState, useRef } from "react"
import { getCurrentDatetime, convertToLocalTime } from '../functions/datetime'
import { createReservation } from '../functions/reservations'

export const ReservationForm = () => {
    const [startDatetime, setStartDatetime] = useState(convertToLocalTime(getCurrentDatetime()))
    const [endDatetime, setEndDatetime] = useState("")
    const [error, setError] = useState("")
    const titleRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault() // prevents the refresh of the page

        const title = titleRef?.current?.value

        if (title) {
            createReservation({
                title,
                start: startDatetime,
                end: endDatetime
        })
    }
}

return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" minLength={1} maxLength={300} ref={titleRef} />
        </div>
        <p>Please note that the date and time selected are in your local time (as reported by the browser) however they are saved into the database with the timezone data in order to ensure consistency between timezones</p>
        <div>
            <label htmlFor="datetime-start">Start date and time</label>
            <input
                type="datetime-local"
                id="datetime-start"
                name="datetime-start"
                value={startDatetime}
                min={convertToLocalTime(getCurrentDatetime())}
                onChange={(e) => setStartDatetime(e.target.value)}
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
        <div>
            <input type="submit" />
        </div>
        <div className="caption error">

        </div>
    </form>
)
}