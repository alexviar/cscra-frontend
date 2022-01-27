import { useEffect, useMemo, useState, useRef } from "react"
import { Button, FormControl, InputGroup } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import { LatLngExpression, Marker as LeafletMarker, Map } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, ZoomControl } from "react-leaflet"
import { latLngExpressionToString } from "../utils"
import "leaflet/dist/leaflet.css";

type Props = {
  isInvalid: boolean
  value: LatLngExpression|null,
  center: LatLngExpression
  onChange: (value?: LatLngExpression|null) => void
}

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const InputLocationControl = ({
  isInvalid,
  value,
  onChange
}: {
  isInvalid: boolean
  value: LatLngExpression | null
  onChange: (value: LatLngExpression | null) => void 
}) => {

  const [search, setSearch] = useState("")

  const map = useMap()

  useEffect(()=>{
    setSearch(latLngExpressionToString(value))
  }, [value])

  return <div className="leaflet-control bg-white"
      ref={(instance: HTMLDivElement)=>{
        if(instance){
          instance.onpointermove = (e:any)=>{
            e.stopPropagation()
          }
          instance.ondblclick = (e:any)=>{
            e.stopPropagation()
          }
        }
      }}
    >  
    <InputGroup>      
      <FormControl
        aria-label="Coordenadas"
        isInvalid={isInvalid}
        value={search}
        onChange={(e)=>{
          setSearch(e.target.value)
        }}
      />
      <InputGroup.Append>
        <Button variant={isInvalid ? "outline-danger" : "outline-secondary"}
          onClick={()=>{
            const coords = search.split(",")
            if(coords.length == 2){
              const [rawLat, rawLng] = coords
              const lat = parseFloat(rawLat)
              const lng = parseFloat(rawLng)
              if(Math.abs(lat) <= 90 && Math.abs(lng) <= 180){
                map.setView([lat, lng], 13)
                onChange([lat, lng])
                return
              }
            }
            onChange(null)
          }}
        ><FaSearch/></Button>
      </InputGroup.Append>
    </InputGroup>
  </div>
}

const CustomMarker = (props: { position: LatLngExpression|null, onChange(position: LatLngExpression|null): void})=>{
  const markerRef =  useRef<LeafletMarker<any>>(null)
  const eventHandlers = useMemo(() => ({
    onclick() {
      const marker = markerRef.current
      if (marker != null) {
        marker.remove()
        props.onChange(null)
      }
    },
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        props.onChange(marker.getLatLng())
      }
    },
  }), [])
  
  const map = useMapEvents({
    click(e) {
      if(e.originalEvent.target && (e.originalEvent.target as HTMLElement).closest(".leaflet-control")) return
      props.onChange(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
      // map.locate()
    }
  })


  if(!props.position) return null
  const [latitude, longitude] = Array.isArray(props.position) ? props.position : [props.position.lat, props.position.lng]
  return <Marker 
    draggable
    ref={markerRef}
    position={props.position}
    eventHandlers={eventHandlers}
  >
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
      <a href={`maps:${latitude},${longitude}`}>Open with...</a>
    </Popup>
  </Marker>
}

export const LocationInput = (props: Props) => {

  return <div className={"border rounded " + (props.isInvalid ? " is-invalid border-danger overflow-hidden" : "")}>
    <MapContainer
      center={props.center}
      zoom={13}
      zoomControl={false}
      style={{height: 240, cursor: "crosshair"}}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div className="leaflet-control-container">
        <div className={POSITION_CLASSES["topleft"]}>
          <InputLocationControl 
            isInvalid={props.isInvalid}
            value={props.value} 
            onChange={(position)=>{
            props.onChange(position)
          }} />
        </div>
      </div>
      
      <CustomMarker position={props.value} onChange={(position)=>{
        props.onChange(position)
      }} />
      <ZoomControl position="bottomright" />
    </MapContainer>
  </div>
}