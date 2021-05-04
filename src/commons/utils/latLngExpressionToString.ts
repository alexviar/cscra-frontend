import {LatLngExpression} from "leaflet"

export const latLngExpressionToString = (value?: LatLngExpression|null) => {
  let lat, lng
  if(value){
    if(Array.isArray(value)){
      [lat, lng] = value
    }
    else{
      ({lat, lng} = value)
    }
    return `${lat.toFixed(8)}, ${lng.toFixed(8)}`
  }
  return ""
}