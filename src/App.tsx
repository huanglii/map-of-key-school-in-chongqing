import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxMap from './components/MapboxMap'
import SearchBar from './components/SearchBar'
import type { DataItem } from './components/SearchBar/SearchEngine'
import { useState } from 'react'
import InfoPanel from './components/InfoPanel'

const App = () => {
  const [item, setItem] = useState<DataItem>()
  const onSelect = (item?: DataItem) => {
    setItem(item)
  }

  return (
    <MapboxMap>
      <SearchBar onSelect={onSelect} />
      {item && <InfoPanel item={item} onClose={() => setItem(undefined)} />}
    </MapboxMap>
  )
}

export default App
