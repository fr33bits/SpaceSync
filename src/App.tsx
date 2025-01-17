import { ReservationForm } from './components/ReservationForm'
import { ReservationTable } from './components/ReservationTable'

import './App.css'

function App() {

  return (
    <>
       <div>
        <div>
          <ReservationTable/>
          <ReservationForm/>
        </div>
       </div>
    </>
  )
}

export default App
