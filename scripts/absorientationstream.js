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
}

export const calcHeadingFromQuaternion = q => Math.round(Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]) * (180 / Math.PI))
export const normalizeHeading = heading => (heading < 0) ? heading += 360 : heading
