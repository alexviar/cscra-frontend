import {LatLngExpression} from "leaflet"

export const latLngExpressionToString = (value: LatLngExpression|null, round: number = 6) => {
  let lat, lng
  if(value){
    if(Array.isArray(value)){
      [lat, lng] = value
    }
    else{
      ({lat, lng} = value)
    }
    return `${lat.toFixed(round)}, ${lng.toFixed(round)}`
  }
  return ""
}