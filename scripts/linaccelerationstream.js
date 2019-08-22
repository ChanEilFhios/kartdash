export function createNewLinAccelerationStream(options) {
  const sensor = new LinearAccelerationSensor(options)

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

export const serializeAcceleration = target => `x=${target.x}<br />y=${target.y}<br />z=${target.z}`