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