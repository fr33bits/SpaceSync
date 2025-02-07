import { useContext } from 'react';
import { useView } from '../contexts/ViewContext.tsx'
import { getNoticeDetails } from '../../common/notices'
import { ReservationContext } from '../contexts/ReservationContext';


import '../styles/Toolbar.css'

export const Toolbar = () => {
    // CONTEXT STATES
    const viewContext = useView()
    const selectedView = viewContext?.selectedView
    const setSelectedView = viewContext?.setSelectedView
    const { 
        setSelectedReservation, 
        changedReservation, 
        handleDelete, 
        discardChanges, 
        handleSubmit, 
        notice: reservationNotice,
        setDefaultReservationFormData, 
    } = useContext(ReservationContext) || {};
    if (!setSelectedView) {
        throw new Error("setSelectedView is undefined")
    }
    if (!setSelectedReservation) {
        throw new Error("setSelectedReservation is undefined")
    }
    if (!setDefaultReservationFormData) {
        throw new Error("setDefaultReservationFormData is undefined")
    }
    if (!handleDelete) {
        throw new Error("handleDelete is undefined")
    }
    if (!discardChanges) {
        throw new Error("discardChanges is undefined")
    }
    if (!handleSubmit) {
        throw new Error("handleSubmit is undefined")
    }

    const exitReservation = () => {
        let allow = false
        if (changedReservation) {
            allow = window.confirm("Are you sure you want to exit this reservation? Your changes will be lost.");
        } else {
            allow = true
        }
        if (allow) {
            setSelectedView('table');
            setSelectedReservation(undefined)
            setDefaultReservationFormData()
        }
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
                {changedReservation && !reservationNotice ?
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
    } else if (
        selectedView === 'reservation-new' &&
        (!reservationNotice || (
            reservationNotice && getNoticeDetails(reservationNotice, true, 'en').type != 'error'
        ))) {
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

    return (
        <div className='toolbar'>
            <div className='toolbar-left'>
                <div className='toolbar-buttons'>
                    {selectedView != 'table' ?
                        <div
                            className='toolbar-button'
                            onClick={() => exitReservation()}
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