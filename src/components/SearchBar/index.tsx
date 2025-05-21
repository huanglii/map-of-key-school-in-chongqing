import type { AutoCompleteProps } from 'antd'
import { AutoComplete, Input } from 'antd'
import { useEffect, useRef, useState, type FC } from 'react'
import SearchEngine, { type DataItem } from './SearchEngine'
import { useMapContext } from '../MapboxMap/useMapContext'

interface SearchBarProps {
  onLoad?: () => void
  onSelect?: (item?: DataItem) => void
}

function csvToArray(str: string, delimiter = ',') {
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter)
  const rows = str.slice(str.indexOf('\n') + 1).split('\n')

  return rows.map(function (row) {
    const values = row.split(delimiter)
    const el = headers.reduce(
      function (object, header, index) {
        object[header] = values[index]
        return object
      },
      {} as Record<string, string>
    )
    return el
  })
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const engineRef = useRef<SearchEngine | null>(null)
  const searchResultRef = useRef<DataItem[]>([])
  const [options, setOptions] = useState<AutoCompleteProps['options']>([])

  const { map } = useMapContext()

  useEffect(() => {
    if (map) {
      map.addInteraction('click', {
        type: 'click',
        target: {
          layerId: 'poi-label-school-1',
        },
        handler: ({ feature }) => {
          props.onSelect?.(feature?.properties as unknown as DataItem)
        },
      })
    }
    return () => {
      if (map) {
        map.removeInteraction('click')
      }
    }
  }, [map])

  useEffect(() => {
    initData()
  }, [])

  const initData = () => {
    fetch('./school.csv')
      .then((r) => r.text())
      .then((text) => {
        const arr = csvToArray(text)
        engineRef.current = new SearchEngine(arr as any)
      })
  }

  const handleSearch = (value: string) => {
    if (value && engineRef.current) {
      const result = engineRef.current.search(value)
      const ops = result.map(({ item }) => ({ value: item.name, label: item.name }))
      searchResultRef.current = result.map(({ item }) => item)
      setOptions(ops)
    } else {
      setOptions([])
    }
  }

  const onSelect = (value: string) => {
    const selectedItem = searchResultRef.current.find((item) => item.name === value)
    props.onSelect?.(selectedItem) // 返回完整item
  }

  return (
    <div className="absolute top-0 left-0 z-10 w-full p-4">
      <AutoComplete style={{ width: '100%' }} options={options} onSelect={onSelect} onSearch={handleSearch}>
        <Input.Search size="large" placeholder="" enterButton allowClear />
      </AutoComplete>
    </div>
  )
}

export default SearchBar
