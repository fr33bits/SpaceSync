import { Reservation } from './Reservation.tsx'
import { ReservationTable } from './ReservationTable.tsx'
import { Toolbar } from './Toolbar.tsx'

import '../styles/App.css'
import { useView } from '../contexts/ViewContext.tsx'

import logo from '../assets/logo.png'

function App() {
  const viewContext = useView()
  const selectedView = viewContext?.selectedView
  
  let view
  if (selectedView === 'reservation-existing' || selectedView === 'reservation-new') {
    view = <Reservation />
  } else {
    view = <ReservationTable />
  }
  return (
    <div className="app-container">
      <div className='header-container'>
        <div className="header">
          <div className="header-logo">
            <img src={logo} alt="SpaceSync logo" draggable='false' />
          </div>
          <div className='header-name michroma-regular'>
            SpaceSync
          </div>
        </div>
      </div>
      <div className='toolbar-container'>
        <Toolbar />
      </div>
      <div className="main-view">
        {view}
      </div>
    </div>
  )
}

export default App
