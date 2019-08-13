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
export const calcHeadingFromQuaternion = ({ quaternion: q }) => Math.round(Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]) * (180 / Math.PI))
export const normalizeHeading = heading => (heading < 0) ? heading += 360 : heading
export const serializeCoords = position => {
  const props = [`timestamp = ${position.timestamp}`]
  const coords = position.coords
  for (let n in coords) {
    props.push(`${n} = ${coords[n]}`)
  }
  return props.join('<br />')
}
