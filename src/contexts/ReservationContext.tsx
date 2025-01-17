import { getReservation, Reservation as ReservationType, ApiResponse, createReservation, updateReservation, deleteReservation } from '../functions/reservations'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentDatetime, convertToLocalTime, getFormattedDatetimeFromUNIX, toUNIXSeconds } from '../functions/datetime'

import { useView } from '../contexts/ViewContext'
import { reservationStaticValidator } from '../functions/common';

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
    const [endDatetime, setEndDatetime] = useState<string>(
        convertToLocalTime(
            getFormattedDatetimeFromUNIX(
                Math.floor(new Date(
                    convertToLocalTime(getCurrentDatetime())
                ).getTime() / 1000)
                + 1200, // default reservation duration: 20 min
                'date_picker-input',
                false
            )
        )
    )

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
                const startDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.start, 'date_picker-input', false)
                const endDatetimeFormatted: string = getFormattedDatetimeFromUNIX(fetchedData.end, 'date_picker-input', false)
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
            setEndDatetime(
                convertToLocalTime(
                    getFormattedDatetimeFromUNIX(
                        Math.floor(new Date(
                            convertToLocalTime(getCurrentDatetime())
                        ).getTime() / 1000)
                        + 1200, // min. reservation duration: 5 min
                        'date_picker-input',
                        false
                    )
                )
            )
        }

        // existing reservation
        fetchReservation()
    }, [selectedReservation])

    // runs on every change in data
    useEffect(() => {
        setError(reservationStaticValidator(title, toUNIXSeconds(startDatetime), toUNIXSeconds(endDatetime)))

        if (fetchedReservation) {
            if (
                title != fetchedReservation.title ||
                startDatetime != getFormattedDatetimeFromUNIX(fetchedReservation.start, 'date_picker-input', false) ||
                endDatetime != getFormattedDatetimeFromUNIX(fetchedReservation.end, 'date_picker-input', false)

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
            setStartDatetime(getFormattedDatetimeFromUNIX(fetchedReservation.start, 'date_picker-input', false))
            setEndDatetime(getFormattedDatetimeFromUNIX(fetchedReservation.end, 'date_picker-input', false))
        } else {
            setError("Unknown error: code 287304")
        }
    }

    const handleSubmit = async () => {
        // e.preventDefault() // prevents the refresh of the page (used to be necessary when it was triggered with a submit button)

        try {
            if (selectedReservation) { // update existing reservation
                await updateReservation({
                    id: selectedReservation,
                    title: title,
                    start: Math.floor(new Date(startDatetime).getTime() / 1000),
                    end: Math.floor(new Date(endDatetime).getTime() / 1000)
                })
                fetchReservation() // would not run if updateReservation fails because that would get caught as an error
            } else { // create new reservation
                const response: ReservationType | ApiResponse = await createReservation({
                    title,
                    start: Math.floor(new Date(startDatetime).getTime() / 1000),
                    end: Math.floor(new Date(endDatetime).getTime() / 1000),
                })

                // ! alternative error handling implmentation with custom error response (chosen the other one because it's simpler):
                // if ('errorCode' in response) { // checks if the response is an error
                //     setError(response)
                // }

                setSelectedReservation(response.id)
                setSelectedView('reservation-existing')
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unknown (not Error) error occurred')
                console.error(error)
            }
        }
    }

    const handleDelete = async () => {
        if (selectedReservation) {
            const result: boolean = await deleteReservation(selectedReservation)

            if (result) { // deletion went through
                // Update views
                setSelectedReservation(undefined)
                setSelectedView('table')
            }
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