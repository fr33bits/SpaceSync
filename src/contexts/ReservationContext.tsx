import axios from 'axios'
import { getReservation, ApiResponse, createReservation, updateReservation, deleteReservation } from '../functions/reservations'

import { Reservation as ReservationType } from '../../common/types'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentDatetime, convertToLocalTime, getFormattedDatetimeFromUNIX, toUNIXSeconds } from '../../common/datetime'

import { useView } from '../contexts/ViewContext'
import { reservationStaticValidator } from '../../common/validation';

interface ReservationContextType {
    selectedReservation: number | undefined
    setSelectedReservation: React.Dispatch<React.SetStateAction<number | undefined>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    startDatetime: string | undefined
    setStartDatetime: React.Dispatch<React.SetStateAction<string>>
    endDatetime: string | undefined
    setEndDatetime: React.Dispatch<React.SetStateAction<string>>
    fetchedReservation: ReservationType | undefined

    loading: boolean
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
    notice: string
    setNotice?: React.Dispatch<React.SetStateAction<string>>
    changedReservation: boolean
    setChangedReservation?: React.Dispatch<React.SetStateAction<boolean>>
    setDefaultReservationFormData: React.Dispatch<React.SetStateAction<void>>

    handleDelete: () => Promise<void>
    handleSubmit: () => Promise<void>
    discardChanges: () => void
}

const ReservationContext = createContext<ReservationContextType | null>(null)

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // MAINTAINED STATES
    const [selectedReservation, setSelectedReservation] = useState<number | undefined>(undefined)
    const [fetchedReservation, setFetchedReservation] = useState<ReservationType | undefined>(undefined)
    const [title, setTitle] = useState<string>("")
    const [startDatetime, setStartDatetime] = useState<string>(
        convertToLocalTime(
            getFormattedDatetimeFromUNIX(
                Math.floor(new Date(
                    convertToLocalTime(getCurrentDatetime())
                ).getTime() / 1000)
                + 3600, // default start time: 1 hour from the current time
                'date_picker-input',
                false
            )
        )
    )
    const [endDatetime, setEndDatetime] = useState<string>(
        convertToLocalTime(
            getFormattedDatetimeFromUNIX(
                Math.floor(new Date(
                    convertToLocalTime(getCurrentDatetime())
                ).getTime() / 1000)
                + 3600 + 1200, // default reservation duration: 20 min
                'date_picker-input',
                false
            )
        )
    )

    const [loading, setLoading] = useState(true)
    const [notice, setNotice] = useState("")
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
                setNotice("")
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setNotice(err.response?.data.noticeCode || err.message)
            } else {
                setNotice(String(err))
            }
        } finally {
            setLoading(false)
        }
    }

    // UPDATE VIEWS
    // on load
    useEffect(() => {
        if (selectedView === 'reservation-new') {
            setSelectedReservation(undefined)
        }
    }, [selectedReservation])

    const setDefaultReservationFormData = () => {
        setTitle("")
        setStartDatetime(convertToLocalTime(
            getFormattedDatetimeFromUNIX(
                Math.floor(new Date(
                    convertToLocalTime(getCurrentDatetime())
                ).getTime() / 1000)
                + 3600, // default start time: 1 hour from the current time
                'date_picker-input',
                false
            )
        ))
        setEndDatetime(
            convertToLocalTime(
                getFormattedDatetimeFromUNIX(
                    Math.floor(new Date(
                        convertToLocalTime(getCurrentDatetime())
                    ).getTime() / 1000)
                    + 3600 + 1200, // min. reservation duration: 5 min
                    'date_picker-input',
                    false
                )
            )
        )
    }

    // populates (state) data
    useEffect(() => {
        if (!selectedReservation) { // new reservation or no reservation selected
            setDefaultReservationFormData()
        }

        // existing reservation
        fetchReservation()
    }, [selectedReservation])

    // runs on every change in data
    useEffect(() => {
        setNotice(reservationStaticValidator(
            title,
            toUNIXSeconds(startDatetime),
            toUNIXSeconds(endDatetime),
            selectedView === 'reservation-new' ? true : false,
            true)
        )

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
            setNotice("")
        } else {
            setNotice("287304")
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
                // if ('noticeCode' in response) { // checks if the response is an error
                //     setNotice(response)
                // }

                setSelectedReservation(response.id)
                setSelectedView('reservation-existing')
            }
            setNotice("")
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setNotice(err.response?.data.noticeCode || err.code || err.message)
            } else {
                setNotice(String(err))
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (selectedReservation) {
            try {
                const result: boolean = await deleteReservation(selectedReservation)

                if (result) { // deletion went through
                    // Update views
                    setSelectedReservation(undefined)
                    setSelectedView('table')
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setNotice(err.response?.data.noticeCode || err.code || err.message)
                } else {
                    setNotice(String(err))
                }
            } finally {
                setLoading(false)
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
        fetchedReservation,
        loading,
        notice,
        changedReservation,
        handleDelete,
        handleSubmit,
        discardChanges,
        setDefaultReservationFormData
    }

    return (
        <ReservationContext.Provider value={values}>
            {children}
        </ReservationContext.Provider>
    )
}

export const useReservation = () => useContext(ReservationContext)