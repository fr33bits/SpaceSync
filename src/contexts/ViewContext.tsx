import React, { createContext, useContext, useState, useEffect } from 'react'

interface ViewContextType {
  selectedView: string;
  setSelectedView: React.Dispatch<React.SetStateAction<string>>;
  selectedReservation: number | undefined;
  setSelectedReservation: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ViewContext = createContext<ViewContextType | null>(null)

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedView, setSelectedView] = useState<string>('table')
  const [selectedReservation, setSelectedReservation] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (selectedView === 'reservation-new') {
      setSelectedReservation(undefined)
    }
  }, [selectedView])


  let values: ViewContextType = {
    selectedView,
    setSelectedView,
    selectedReservation,
    setSelectedReservation
  }

  return (
      <ViewContext.Provider value={values}>
        { children }
      </ViewContext.Provider>
    )
}

export const useView = () => useContext(ViewContext)