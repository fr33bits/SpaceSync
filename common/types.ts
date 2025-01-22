// ! cannot be imported into /api/controllers/reservations.ts for some reason

export interface Reservation {
    id?: number,
    title: string,
    start: number,
    end: number,
    created_at?: number,
    last_modified_at?: number
}