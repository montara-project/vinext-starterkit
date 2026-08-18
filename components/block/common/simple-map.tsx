/* eslint-disable react-hooks/set-state-in-effect */
import { MapPin } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import {
  Map,
  MapControls,
  MapMarker,
  MapRef,
  MapViewport,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map'

interface SimpleMapProps {
  lat: string
  lng: string
  zoom?: number
  onMarkerChange?: (position: { lng: number; lat: number }) => void
  showLocate?: boolean
  showCompass?: boolean
}

const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/bright',
  dark: 'https://tiles.openfreemap.org/styles/bright',
} as const

export default function SimpleMap({
  lat,
  lng,
  zoom = 8,
  onMarkerChange,
  showLocate = false,
  showCompass = false,
}: SimpleMapProps) {
  const parsedLng = parseFloat(lng)
  const parsedLat = parseFloat(lat)

  const [viewport, setViewport] = useState<MapViewport>({
    center: [parsedLng, parsedLat],
    zoom: zoom,
    bearing: 0,
    pitch: 0,
  })

  const [markerPosition, setMarkerPosition] = useState({
    lng: parsedLng,
    lat: parsedLat,
  })

  const mapRef = useRef<MapRef>(null)
  const prevPropsRef = useRef({ lat, lng })

  useEffect(() => {
    if (!isNaN(parsedLng) && !isNaN(parsedLat)) {
      const propsChanged = prevPropsRef.current.lat !== lat || prevPropsRef.current.lng !== lng

      if (propsChanged) {
        setMarkerPosition({ lng: parsedLng, lat: parsedLat })
        prevPropsRef.current = { lat, lng }

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [parsedLng, parsedLat], zoom: zoom })
        }
      }
    }
  }, [lat, lng, zoom, parsedLat, parsedLng])

  return (
    <React.Fragment>
      <Map
        viewport={viewport}
        onViewportChange={setViewport}
        styles={MAP_STYLES}
        className="rounded-lg"
        ref={mapRef}
      >
        <MapControls
          position="bottom-right"
          showZoom
          showCompass={showCompass}
          showLocate={showLocate}
          showFullscreen
        />
        <MapMarker
          draggable
          longitude={markerPosition.lng}
          latitude={markerPosition.lat}
          onDragEnd={(lngLat) => {
            setMarkerPosition({ lng: lngLat.lng, lat: lngLat.lat })
            onMarkerChange?.({ lng: lngLat.lng, lat: lngLat.lat })
          }}
        >
          <MarkerContent>
            <div className="cursor-move">
              <MapPin className="size-10 fill-blue-600 stroke-white dark:fill-white" />
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div className="space-y-1">
              <p className="text-foreground font-medium">Coordinates</p>
              <p className="text-muted-foreground text-xs">
                {markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}
              </p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>

      <div className="bg-background/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border px-2 py-1.5 font-mono text-xs backdrop-blur">
        <span>
          <span className="text-muted-foreground">lng:</span> {viewport.center[0].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">lat:</span> {viewport.center[1].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">zoom:</span> {viewport.zoom.toFixed(1)}
        </span>
        <span>
          <span className="text-muted-foreground">bearing:</span> {viewport.bearing.toFixed(1)}°
        </span>
        <span>
          <span className="text-muted-foreground">pitch:</span> {viewport.pitch.toFixed(1)}°
        </span>
      </div>
    </React.Fragment>
  )
}
