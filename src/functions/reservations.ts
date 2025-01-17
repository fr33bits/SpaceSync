import axios, { AxiosResponse } from 'axios'

interface Reservation {
    title: string,
    start: string,
    end: string
}

interface ApiResponse {
    message: string,
    id?: number
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