import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxMap from './components/MapboxMap'
import { useMapContext } from './components/MapboxMap/useMapContext'
import { useEffect } from 'react'

const ChildComponent: React.FC = () => {
  const { map } = useMapContext()

  useEffect(() => {
    if (map) {
      // 使用 map 对象
      map.addLayer({
        id: 'layer-id',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-74.5, 40],
                },
                properties: {},
              },
            ],
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#f00',
        },
      })
    }
  }, [map])

  return null
}

const MapboxExample = () => {
  return (
    <MapboxMap>
      <ChildComponent />
    </MapboxMap>
  )
}

export default MapboxExample
