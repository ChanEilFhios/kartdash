import {
  degToRad
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

export const calcSpeedFromLocations = ([firstPos, secondPos]) => {
  const earthRadius = 6372800
  const firstLatInRad = degToRad(firstPos.coords.latitude)
  const secondLatinRad = degToRad(secondPos.coords.latitude)
  const latDiff = secondLatinRad - firstLatInRad
  const longDiff = degToRad(secondPos.coords.longitude - firstPos.coords.longitude)
  const a = Math.sin(latDiff/2)^2 + Math.sin(longDiff/2)^2 * Math.cos(firstLatInRad) * Math.cos(secondLatinRad)
  const distance = 2 * earthRadius * Math.atan2(a^0.5, (1-a)^0.5)

  return distance / (secondPos.timestamp - firstPos.timestamp)
}