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
        // console.log("Fetched reservations: ", data)
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
        console.log("Fetched reservation: ", data)
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

export const createReservation = async (reservation: Reservation): Promise<void> => {
    try {
        const response: AxiosResponse<ApiResponse> = await axios.post(
            "http://localhost:4000" + "/api/reservations",
            {
                title: reservation.title,
                start: Math.floor(new Date(reservation.start).getTime() / 1000),
                end: Math.floor(new Date(reservation.end).getTime() / 1000)
            }
        )
        console.log("Added new reservation: ", response)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected error: ", error)
        }
    }
}