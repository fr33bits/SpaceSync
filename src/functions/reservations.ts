import axios, { AxiosResponse } from 'axios'

export interface Reservation {
    id?: number,
    title: string,
    start: number,
    end: number,
    created_at?: number,
    last_modified_at?: number
}

export interface ApiResponse {
    message: string,
    id?: number,
    errorCode?: string // my custom implementation
}

export const getReservations = async (): Promise<Reservation[]> => {
    try {
        const response: AxiosResponse<any> = await axios.get(
            "http://localhost:4000" + "/api/reservations",
        )
        const data: Reservation[] = response.data
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
        throw error
    }
}

export const getReservation = async (reservation_id: number): Promise<Reservation> => {
    try {
        const response: AxiosResponse<any> = await axios.get(
            "http://localhost:4000" + `/api/reservations/${reservation_id}`,
        )
        const data: Reservation = response.data[0]
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
        throw error
    }
}

export const createReservation = async (reservation: Reservation): Promise<Reservation | ApiResponse> => {
    try {
        const response: AxiosResponse<any> = await axios.post(
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
            throw new Error(error.response?.data.errorCode ?? error.message)
            
            // ! alternative error handling; could also use throw instead of return but would need to handle in catch
            // return {errorCode: error.response?.data.errorCode, message: error.message}
        } else {
            console.error("Not an Axios error", error)
            throw error
        }
    }
}

export const updateReservation = async (reservation: Reservation): Promise<void | string> => {
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
            throw new Error(error.response?.data.errorCode ?? error.message)
        } else {
            console.error("Not an Axios error", error)
            throw error
        }
    }
}

export const deleteReservation = async (reservation_id: number): Promise<boolean> => {
    const confirmation = window.confirm("Are you sure you want to delete this reservation?");
    if (confirmation) {
        try {
            const response: AxiosResponse<any> = await axios.delete(
                "http://localhost:4000" + `/api/reservations/${reservation_id}`,
            )
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios error: ", error.response?.data || error.message)
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