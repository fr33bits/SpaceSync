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
    discardChanges: any
}

const ReservationContext = createContext<ReservationContextType | null>(null)

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // MAINTAINED STATES
    const [selectedReservation, setSelectedReservation] = useState<number | undefined>(undefined)
    const [fetchedReservation, setFetchedReservation] = useState<ReservationType | undefined>(undefined)
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

    // FUNCTIONS
    const fetchReservation = async () => {
        try {
            if (selectedReservation) {
                const fetchedData: ReservationType = await getReservation(selectedReservation)
                setFetchedReservation(fetchedData)
                setTitle(fetchedData.title)
                const startDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.start, "date_picker-input")
                const endDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.end, "date_picker-input")
                setStartDatetime(startDatetimeFormatted)
                setEndDatetime(endDatetimeFormatted)
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    // UPDATE VIEWS
    // on load
    useEffect(() => {
        if (selectedView === 'reservation-new') {
            setSelectedReservation(undefined)
        }
    }, [selectedReservation])
    
    // populates (state) data
    useEffect(() => {
        if (!selectedReservation) { // new reservation or no reservation selected
            setTitle("")
            setStartDatetime(convertToLocalTime(getCurrentDatetime()))
            setEndDatetime(convertToLocalTime(getCurrentDatetime()))
        }

        // existing reservation
        fetchReservation()
    }, [selectedReservation])

    // detects if changes have been made compared to the fetched data
    useEffect(() => {
        if (fetchedReservation) {
            if (
                title != fetchedReservation.title ||
                startDatetime != getFormattedDatetimeFromUNIX(fetchedReservation.start, "date_picker-input") ||
                endDatetime != getFormattedDatetimeFromUNIX(fetchedReservation.end, "date_picker-input")
    
            ) {
                setChangedReservation(true)
            } else {
                setChangedReservation(false)
            }
        } else {
            setChangedReservation(false)
        }
    }, [fetchedReservation, title, startDatetime, endDatetime])

    // ACTIONS
    const discardChanges = () => {
        if (fetchedReservation && changedReservation) {
            setTitle(fetchedReservation.title)
            setStartDatetime(getFormattedDatetimeFromUNIX(fetchedReservation.start, "date_picker-input"))
            setEndDatetime(getFormattedDatetimeFromUNIX(fetchedReservation.end, "date_picker-input"))
        } else {
            setError("This should not have occured. Please report this bug.")
        }
    }

    const handleSubmit = async () => {
        // e.preventDefault() // prevents the refresh of the page (used to be necessary when it was triggered with a submit button)

        if (!title) {
            setError('title-undefined')
            return
        }
        if (!startDatetime) {
            setError('startDatetime-undefined')
            return
        }
        if (!endDatetime) {
            setError('endDatetime-undefined')
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

                // TODO: should only run where updateReservation was sucessful 
                fetchReservation()
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
            setError("title-empty")
        }
    }

    const handleDelete = () => {
        if (selectedReservation) {
            deleteReservation(selectedReservation)

            // Update views
            setSelectedReservation(undefined)
            setSelectedView('table')
        }
    }

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
        handleSubmit,
        discardChanges
    }

    return (
        <ReservationContext.Provider value={values}>
            {children}
        </ReservationContext.Provider>
    )
}

export const useReservation = () => useContext(ReservationContext)