import React, { createContext, useContext, useState } from 'react'

interface ViewContextType {
  selectedView: string;
  setSelectedView: React.Dispatch<React.SetStateAction<string>>;
}

const ViewContext = createContext<ViewContextType | null>(null)

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedView, setSelectedView] = useState<string>('table')

  let values: ViewContextType = {
    selectedView,
    setSelectedView
  }

  return (
      <ViewContext.Provider value={values}>
        { children }
      </ViewContext.Provider>
    )
}

export const useView = () => useContext(ViewContext)