import { useState } from 'react'
import { Reservation } from './components/Reservation'
import { ReservationTable } from './components/ReservationTable'

import './styles/App.css'

function App() {
  const [selectedReservation, setSelectedReservation] = useState(null)

  let view
  if (selectedReservation) {
    view = <Reservation selectedReservation={selectedReservation} setSelectedReservation={setSelectedReservation}/>
  } else {
    view = <ReservationTable setSelectedReservation={setSelectedReservation}/>
  }
  return (
    <>
       <div className="app-viewport">
        <div className="app-header">SpaceSync</div>
        <div className="app-body">
          {view}
        </div>
       </div>
    </>
  )
}

export default App
