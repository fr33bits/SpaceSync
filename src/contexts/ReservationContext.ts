import { createContext } from 'react';
import { Reservation as ReservationType } from '../../common/types'

export type ReservationContextType = {
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

export const ReservationContext = createContext<ReservationContextType | null>(null);