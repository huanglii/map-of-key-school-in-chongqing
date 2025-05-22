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
      style: 'mapbox://styles/huanglii/cmaqrymop01em01si3gl1a50u',
      center: [106.5344, 29.6095],
      zoom: 10,
      // hash: true,
      attributionControl: false,
    })
    mapInstance.addControl(new mapboxgl.NavigationControl({
      visualizePitch: true,
    }), 'top-left')

    mapInstance.on('load', () => {
      setMap(mapInstance)

      mapInstance.addSource('school', {
        type: 'geojson',
        data: './school.geojson',
      })
      mapInstance.addLayer({
        id: 'poi-label-school-1',
        type: 'symbol',
        source: 'school',
        layout: {
          'icon-image': 'school',
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 12, 15, 16],
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-field': ['get', 'name'],
          'text-anchor': 'top',
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-halo-color': 'hsl(60, 20%, 98%)',
          'text-halo-width': 0.5,
          'text-halo-blur': 0.5,
          'text-color': 'hsl(30, 60%, 28%)',
        },
      })
    })

    return () => {
      mapInstance.remove()
      setMap(null)
    }
  }, [])

  return (
    <MapContext.Provider value={{ map }}>
      <div className="size-full">
        <div ref={mapContainerRef} className="size-full" />
        <div className="">{props.children}</div>
      </div>
    </MapContext.Provider>
  )
}

export default MapboxMap
