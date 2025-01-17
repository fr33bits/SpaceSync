import express from 'express'
const router = express.Router()

import ctrlReservations from '../controllers/reservations.ts'

router.get('/reservations', ctrlReservations.reservations)
router.get('/reservations/:id', ctrlReservations.reservation)
router.post('/reservations', ctrlReservations.newReservation)
router.put('/reservations', ctrlReservations.updateReservation)
router.delete('/reservations/:id', ctrlReservations.deleteReservation)

export default router