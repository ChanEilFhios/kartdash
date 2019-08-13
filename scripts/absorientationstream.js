export function createNewAbsOrientationStream(options) {
  const sensor = new AbsoluteOrientationSensor(options)

  return Kefir.stream(emitter => {
    sensor.addEventListener("reading", emitter.value)
    sensor.start()

    return () => {
      sensor.removeEventListener("reading", emitter.value)
      sensor.stop()
    }
  })
  .map(e => e.target)
}

export const normalizeHeading = heading => (heading < 0) ? heading += 360 : heading
