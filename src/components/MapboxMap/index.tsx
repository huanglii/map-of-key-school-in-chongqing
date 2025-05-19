import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState, type FC } from 'react'
import { MapContext } from './useMapContext'

interface MapboxMapProps {
  children?: React.ReactNode
}

const MapboxMap: FC<MapboxMapProps> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHVhbmdsaWkiLCJhIjoiY204Nnl4MnVuMDFubTJqczdtZjh0bms0cCJ9.YH1Gr6B08lNgU0gJ_CZ6Rw'

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [-74.5, 40],
      zoom: 9,
    })

    mapInstance.on('load', () => {
      setMap(mapInstance)
    })

    return () => {
      mapInstance.remove()
      setMap(null)
    }
  }, [])

  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapContainerRef} className="size-full" />
      {props.children}
    </MapContext.Provider>
  )
}

export default MapboxMap
