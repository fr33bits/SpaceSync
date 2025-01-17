import axios, { AxiosResponse } from 'axios'

export interface Reservation {
    id?: number,
    title: string,
    start: number,
    end: number,
    created_at?: number,
    last_modified_at?: number
}

interface ApiResponse {
    message: string,
    id?: number
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

export const createReservation = async (reservation: Reservation): Promise<Reservation> => {
    try {
        const response: AxiosResponse<any> = await axios.post(
            "http://localhost:4000" + "/api/reservations",
            {
                title: reservation.title,
                start: reservation.start,
                end: reservation.end
            }
        )
        console.log("Added new reservation: ", response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
        throw error
    }
}

export const updateReservation = async (reservation: Reservation): Promise<void> => {
    try {
        const response: AxiosResponse<ApiResponse> = await axios.put(
            "http://localhost:4000" + "/api/reservations",
            {
                id: reservation.id,
                title: reservation.title,
                start: reservation.start,
                end: reservation.end
            }
        )
        console.log("Updated reservation: ", response)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
    }
}

export const deleteReservation = async (reservation_id: number): Promise<void> => {
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
}