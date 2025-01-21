import { useView } from '../contexts/ViewContext.tsx'
import { useReservation } from '../contexts/ReservationContext.tsx'

import '../styles/Toolbar.css'

export const Toolbar = () => {
    // CONTEXT STATES
    const viewContext = useView()
    const selectedView = viewContext?.selectedView
    const setSelectedView = viewContext?.setSelectedView
    const reservationContext = useReservation()
    const setSelectedReservation = reservationContext?.setSelectedReservation
    const changedReservation = reservationContext?.changedReservation
    const handleDelete = reservationContext?.handleDelete
    const discardChanges = reservationContext?.discardChanges
    const handleSubmit = reservationContext?.handleSubmit
    const reservationError = reservationContext?.error
    if (!setSelectedView) {
        throw new Error("setSelectedView is undefined")
    }
    if (!setSelectedReservation) {
        throw new Error("setSelectedReservation is undefined")
    }

    let toolbar_right
    if (selectedView === 'reservation-existing') {
        toolbar_right = (
            <div className='toolbar-buttons'>
                <div
                    className='toolbar-button'
                    onClick={() => handleDelete()}
                    title='Delete reservation'
                >
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                </div>
                {changedReservation && !reservationError ?
                    <>
                        <div
                            className='toolbar-button'
                            onClick={() => discardChanges()}
                            title='Discard changes'
                        >
                            <span className="material-symbols-outlined">
                                clear
                            </span>
                        </div>
                        <div
                            className='toolbar-button'
                            onClick={() => handleSubmit()}
                            title='Update reservation'
                        >
                            <span className="material-symbols-outlined">
                                check
                            </span>
                        </div>
                    </> : null
                }
            </div>
        )
    } else if (selectedView === 'reservation-new' && !reservationError) {
        toolbar_right = (
            <div className='toolbar-buttons'>
                <div
                    className='toolbar-button'
                    onClick={() => handleSubmit()}
                    title='Create reservation'
                >
                    <span className="material-symbols-outlined">
                        check
                    </span>
                </div>
            </div>
        )
    }

    // TODO: add prevention for losing changes when switching views
    return (
        <div className='toolbar'>
            <div className='toolbar-left'>
                <div className='toolbar-buttons'>
                    {selectedView != 'table' ?
                        <div
                            className='toolbar-button'
                            onClick={() => { setSelectedView('table'); setSelectedReservation(undefined) }}
                            title='Go back to the table of reservations'
                        >
                            <span className="material-symbols-outlined">
                                table_rows
                            </span>
                        </div> : null
                    }
                    {selectedView != 'reservation-new' ?
                        <div
                            className='toolbar-button'
                            onClick={() => { setSelectedView('reservation-new'); setSelectedReservation(undefined) }}
                            title='New reservation'
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>
                        </div> : null
                    }
                </div>
            </div>
            <div className='toolbar-right'>
                {toolbar_right}
            </div>
        </div>
    )
}