import {
  haversine
} from './trigutils.js'

export function createGeoLocationStream(options) {
  const streamGeoLocation = emitter => {
    if (navigator && navigator.geolocation) {
      const positionWatcher = navigator.geolocation.watchPosition(emitter.value, emitter.error, options)

      return () => navigator.geolocation.clearWatch(positionWatcher)
    } else {
      emitter.error("geoLocation required!")
    }
  }

  return Kefir.stream(streamGeoLocation)
}

export const extractSpeed = position => position.coords.speed
export const serializeCoords = position => {
  const props = [`timestamp = ${position.timestamp}`]
  const coords = position.coords
  for (let n in coords) {
    props.push(`${n} = ${coords[n]}`)
  }
  return props.join('<br />')
}

export const calcSpeedFromLocations = ([firstPos, secondPos]) => haversine(firstPos.coords, secondPos.coords) / (secondPos.timestamp - firstPos.timestamp) * 1000