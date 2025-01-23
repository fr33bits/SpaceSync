import axios, { AxiosResponse } from 'axios'
import {Reservation } from '../../common/types'

export interface ApiResponse {
    message: string,
    id?: number,
    noticeCode?: string // my custom implementation
}

export const getReservations = async (): Promise<Reservation[]> => {
    try {
        const response: AxiosResponse = await axios.get( 
            "http://localhost:4000" + "/api/reservations",
        )
        const data: Reservation[] = response.data
        return data
    } catch (error) {
        console.log("ERROR: ", error)
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data.error || error.message)

            // ! alternative error handling; could also use throw instead of return but would need to handle in catch
            // return {noticeCode: error.response?.data.error.noticeCode, message: error.message}
        } else {
            console.error("Unexpected error: ", error)
        }
        throw error
    }
}

export const getReservation = async (reservation_id: number): Promise<Reservation> => {
    try {
        const response: AxiosResponse = await axios.get(
            "http://localhost:4000" + `/api/reservations/${reservation_id}`,
        )
        const data: Reservation = response.data[0]
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data.error || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
        throw error
    }
}

export const createReservation = async (reservation: Reservation): Promise<Reservation> => {
    try {
        const response: AxiosResponse = await axios.post(
            "http://localhost:4000" + "/api/reservations",
            {
                title: reservation.title,
                start: reservation.start,
                end: reservation.end
            }
        )
        return response.data
    } catch (error) { // throws the error to where the call originated from
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data.error || error.message)
        } else {
            console.error("Not an Axios error", error)
        }
        throw error
    }
}

export const updateReservation = async (reservation: Reservation): Promise<void> => {
    try {
        await axios.put(
            "http://localhost:4000" + "/api/reservations",
            {
                id: reservation.id,
                title: reservation.title,
                start: reservation.start,
                end: reservation.end
            }
        )
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data.error || error.message)
        } else {
            console.error("Not an Axios error", error)
        }
        throw error
    }
}

export const deleteReservation = async (reservation_id: number): Promise<boolean> => {
    const confirmation = window.confirm("Are you sure you want to delete this reservation?");
    if (confirmation) {
        try {
            await axios.delete(
                "http://localhost:4000" + `/api/reservations/${reservation_id}`,
            )
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios error: ", error.response?.data.error || error.message)
            } else {
                console.error("Unexpected error: ", error)
            }
            throw error
        }
        return true
    } else {
        return false // needed to signal whether the deletion went through (which may or may not instigate view changes)
    }
}