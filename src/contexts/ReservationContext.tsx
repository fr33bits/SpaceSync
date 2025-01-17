import { getReservation, Reservation as ReservationType, createReservation, updateReservation, deleteReservation } from '../functions/reservations'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentDatetime, convertToLocalTime, getFormattedDatetimeFromUNIX } from '../functions/datetime'

import { useView } from '../contexts/ViewContext'

interface ReservationContextType {
    selectedReservation: number | undefined;
    setSelectedReservation: React.Dispatch<React.SetStateAction<number | undefined>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    startDatetime: string | undefined;
    setStartDatetime: React.Dispatch<React.SetStateAction<string>>;
    endDatetime: string | undefined;
    setEndDatetime: React.Dispatch<React.SetStateAction<string>>;

    loading: boolean,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    error: string,
    setError?: React.Dispatch<React.SetStateAction<string>>;
    changedReservation: boolean,
    setChangedReservation?: React.Dispatch<React.SetStateAction<boolean>>

    handleDelete: any
    handleSubmit: any
}

const ReservationContext = createContext<ReservationContextType | null>(null)

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // MAINTAINED STATES
    const [selectedReservation, setSelectedReservation] = useState<number | undefined>(undefined)
    const [title, setTitle] = useState<string>("")
    const [startDatetime, setStartDatetime] = useState<string>(convertToLocalTime(getCurrentDatetime()))
    const [endDatetime, setEndDatetime] = useState<string>("")
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [changedReservation, setChangedReservation] = useState(false)
    
    // OTHER CONTEXTS
    const viewContext = useView()
    const selectedView = viewContext?.selectedView
    const setSelectedView = viewContext?.setSelectedView
    if (!setSelectedView) {
        throw new Error("setSelectedView is undefined")
    }

    // ACTIONS
    const handleSubmit = async () => {
            // e.preventDefault() // prevents the refresh of the page (used to be necessary when it was triggered with a submit button)
    
            if (!title) {
                setError('title_undefined')
                return
            }
            if (!startDatetime) {
                setError('startDatetime_undefined')
                return
            }
            if (!endDatetime) {
                setError('endDatetime_undefined')
                return
            }
    
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
            } else {
                setError("Title must not be empty!")
            }
        }

    const handleDelete = () => {
        if (!setSelectedView) {
            throw new Error("setSelectedView is not defined")
        }
        if (!setSelectedReservation) {
            throw new Error("setSelectedReservation is not defined")
        }

        if (selectedReservation) {
            deleteReservation(selectedReservation)

            // Update views
            setSelectedReservation(undefined)
            setSelectedView('table')
        }
    }

    // UPDATE VIEWS
    // on load
    useEffect(() => {
        if (selectedView === 'reservation-new') {
            setSelectedReservation(undefined)
        }
    }, [selectedReservation])

    let fetchedData: ReservationType // repurposed later for checking the types
    useEffect(() => {
        if (!selectedReservation) { // new reservation or no reservation selected
            setTitle("")
            setStartDatetime(convertToLocalTime(getCurrentDatetime()))
            setEndDatetime(convertToLocalTime(getCurrentDatetime()))
        }

        // existing reservation
        const fetchReservation = async () => {
            try {
                if (selectedReservation) {
                    fetchedData = await getReservation(selectedReservation)
                    setTitle(fetchedData.title)
                    const startDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.start, "date_picker-input")
                    const endDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.end, "date_picker-input")
                    setStartDatetime(startDatetimeFormatted)
                    setEndDatetime(endDatetimeFormatted)
                    setLoading(false)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchReservation()
    }, [selectedReservation])

    // detects if changes have been made compared to the fetched data
    useEffect(() => {
        // TODO: detects if changes were made since the last update
        setChangedReservation(true)
    }, [title, startDatetime, endDatetime])


    let values: ReservationContextType = {
        selectedReservation,
        setSelectedReservation,
        title,
        setTitle,
        startDatetime,
        setStartDatetime,
        endDatetime,
        setEndDatetime,
        loading,
        error,
        changedReservation,
        handleDelete,
        handleSubmit
    }

    return (
        <ReservationContext.Provider value={values}>
            {children}
        </ReservationContext.Provider>
    )
}

export const useReservation = () => useContext(ReservationContext)