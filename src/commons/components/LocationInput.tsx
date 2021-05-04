import { useMemo, useState, useRef } from "react"
import { Button, FormControl, InputGroup } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import L, { LatLngExpression, Marker as LeafletMarker, Map } from "leaflet"
import { MapContainer, Marker, MarkerProps, Popup, TileLayer, useMapEvents, ZoomControl } from "react-leaflet"
import { latLngExpressionToString } from "../utils"
import "leaflet/dist/leaflet.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  value: LatLngExpression|null,
  center: LatLngExpression
  onChange: (value?: LatLngExpression|null) => void
}

const CustomMarker = (props: Omit<MarkerProps, "position"> & {position: LatLngExpression|null, onChange(position: LatLngExpression|null): void})=>{
  const markerRef =  useRef<LeafletMarker<any>>(null)
  const eventHandlers = useMemo(
    () => ({
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
    }),
    [],
  )
  
  const map = useMapEvents({
    click(e) {
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

  const [search, setSearch] = useState(()=>{
    return latLngExpressionToString(props.value)
  })
  const mapRef = useRef<Map>(null)

  return <>
    <MapContainer
      //@ts-ignore
      whenCreated={ mapInstance => { mapRef.current = mapInstance } }
      center={props.center}
      zoom={13}
      zoomControl={false}
      style={{height: 240, cursor: "crosshair"}}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div className="leaflet-control-container"
      >
        <div className="leaflet-top leaflet-left" style={{zIndex: 999}}>
        <InputGroup className="leaflet-control bg-white"
          ref={(instance: HTMLDivElement)=>{
            if(instance){
              instance.onclick = (e:any)=>{
                e.stopPropagation()
              }
              instance.onmousemove = (e:any)=>{
                console.log("OnMove")
                e.stopPropagation()
              }
              instance.ondblclick = (e:any)=>{
                e.stopPropagation()
              }
            }
          }}
        >
          <FormControl
            value={search}
            onClick={(e: any)=>{
              console.log("ASFA")
              e.preventDefault()
              e.stopPropagation()
            }}
            onChange={(e)=>{
              const value = e.target.value
              setSearch(value)
            }}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary"
              ref={(instance: any) => {
                if(instance){
                  instance.onclick = ()=>{
                    const coords = search.split(",")
                    if(coords.length == 2){
                      const [rawLat, rawLng] = coords
                      const [lat, lng] = [parseFloat(rawLat), parseFloat(rawLng)]
                      if(Math.abs(lat) <= 90 && Math.abs(lng) <= 180){
                        mapRef.current!.setView([lat, lng], 13)
                        props.onChange([lat, lng])
                      }
                    }
                  }
                }
              }}
              onClick={()=>{
              }}
            ><FaSearch/></Button>
          </InputGroup.Append>
        </InputGroup>
        </div>
      </div>
      <CustomMarker position={props.value} onChange={(position)=>{
        props.onChange(position)
        setSearch(latLngExpressionToString(position))
      }} />
      <ZoomControl position="bottomright" />
    </MapContainer>
  </>
}