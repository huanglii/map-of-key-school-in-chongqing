import { createContext, useContext } from 'react'

interface MapContextType {
  map: mapboxgl.Map | null
}

export const MapContext = createContext<MapContextType>({ map: null })

export const useMapContext = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}
