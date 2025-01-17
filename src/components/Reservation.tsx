import React, { useState, useRef, useEffect } from "react"
import { getCurrentDatetime, convertToLocalTime, getFormattedDatetimeFromUNIX } from '../functions/datetime'
import { createReservation, getReservation, Reservation as ReservationType, updateReservation, deleteReservation } from '../functions/reservations'

import { useView } from '../contexts/ViewContext.tsx'

export const Reservation: React.FC = () => {
    const [startDatetime, setStartDatetime] = useState(convertToLocalTime(getCurrentDatetime()))
    const [endDatetime, setEndDatetime] = useState("")
    const [error, setError] = useState("")
    const titleRef = useRef<HTMLInputElement>(null)
    const viewContext = useView()
    const selectedReservation = viewContext?.selectedReservation
    const setSelectedReservation = viewContext?.setSelectedReservation
    const setSelectedView = viewContext?.setSelectedView
    if (!setSelectedReservation) {
        return <div>ERROR: setSelectedReservation is undefined!</div>
    }
    if (!setSelectedView) {
        return <div>ERROR: setSelectedView is undefined!</div>
    }

    useEffect(() => {
        if (!selectedReservation) {
            setStartDatetime(convertToLocalTime(getCurrentDatetime()))
            setEndDatetime(convertToLocalTime(getCurrentDatetime()))
            if (titleRef?.current?.value) {
                titleRef.current.value = ""
            }
        }

        const fetchReservation = async () => {
            try {
                if (selectedReservation) {
                    const data: ReservationType = await getReservation(selectedReservation)
                    const startDatetimeFormatted: string = getFormattedDatetimeFromUNIX(data.start, "date_picker-input")
                    const endDatetimeFormatted: string = getFormattedDatetimeFromUNIX(data.end, "date_picker-input")
                    setStartDatetime(startDatetimeFormatted)
                    setEndDatetime(endDatetimeFormatted)
                    if (titleRef.current) {
                        titleRef.current.value = data.title
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchReservation()
    }, [selectedReservation])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // prevents the refresh of the page

        const title = titleRef?.current?.value

        if (title) {
            if (selectedReservation) { // update existing reservation
                updateReservation({
                    id: selectedReservation,
                    title: title,
                    start: Math.floor(new Date(startDatetime).getTime() / 1000),
                    end: Math.floor(new Date(endDatetime).getTime() / 1000)
                })
            } else { // create new reservation
                const createdReservation: ReservationType = await createReservation({
                    title,
                    start: Math.floor(new Date(startDatetime).getTime() / 1000),
                    end: Math.floor(new Date(endDatetime).getTime() / 1000),
                })
                if (createdReservation.id) {
                    setSelectedReservation(createdReservation.id)
                    setSelectedView('reservation-existing')
                }
            }
        }
    }

    const handleDelete = () => {
        if (selectedReservation) {
            deleteReservation(selectedReservation)
            setSelectedReservation(undefined)
        }
    }

    let existingReservationButtons
    if (selectedReservation) {
        existingReservationButtons = (
            <div className="">
                <button onClick={handleDelete}>Delete reservation</button>
            </div>
        )
    }

    return (
        <div>
            <button onClick={() => {setSelectedView('table'); setSelectedReservation(undefined)}}>Back to the table of reservations</button>
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
                        min={selectedReservation ? "" : convertToLocalTime(getCurrentDatetime())}
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
                    <input type="submit" value={selectedReservation ? 'Update' : 'Create'} />
                </div>
            </form>
            {existingReservationButtons}
            <div className="caption error">
            </div>
        </div>
    )
}