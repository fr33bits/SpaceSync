import { Reservation } from './components/Reservation'
import { ReservationTable } from './components/ReservationTable'

import './styles/App.css'
import { useView } from './contexts/ViewContext.tsx'

function App() {
  const viewContext = useView()
  const selectedView = viewContext?.selectedView
  const setSelectedView = viewContext?.setSelectedView
  const setSelectedReservation = viewContext?.setSelectedReservation
  if (!setSelectedView) { // necessary so that setSelectedView can be used
    return <div>ERROR: setSelectedView is undefined!</div>
  }
  if (!setSelectedReservation) { // necessary so that setSelectedReservation can be used
    return <div>ERROR: setSelectedReservation is undefined!</div>
  }

  let view
  if (selectedView === 'reservation-existing' || selectedView === 'reservation-new') {
    view = <Reservation/>
  } else {
    view = <ReservationTable/>
  }
  return (
    <>
       <div className="app-viewport">
        <div className="app-header">SpaceSync</div>
        <div className="app-body">
        <button onClick={() => {setSelectedView('reservation-new'); setSelectedReservation(undefined)}} >
          New reservation
        </button>
          {view}
        </div>
       </div>
    </>
  )
}

export default App
