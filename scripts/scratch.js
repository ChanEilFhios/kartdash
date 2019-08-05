const elUpdater = id => {
  const el = document.getElementById(id)
  return (text) => el.innerHTML = text
}

const setElStyle = (el, attr, value) => () => el.style[attr] = value
const displayEl = (el, show) => setElStyle(el, "display", show ? "block": "none")

const calcHeadingFromQuaternion = q => Math.round(Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]) * (180 / Math.PI))
const normalizeHeading = heading => (heading < 0) ? heading += 360 : heading
const decorateHeading = heading => `${heading} degrees`
const updateOrientation = elUpdater("orientation") 

const sensor = new AbsoluteOrientationSensor()
const orientationStream = Kefir.fromEvents(sensor, 'reading')
  .map(e => e.target.quaternion)
  .map(calcHeadingFromQuaternion)
  .map(normalizeHeading)
  .map(decorateHeading)

orientationStream.onValue(updateOrientation)

let positionWatcher

const streamGeoLocation = emitter => {
  if (navigator && navigator.geolocation) {
    positionWatcher = navigator.geolocation.watchPosition(emitter.value, emitter.error, {
      enabledHighAccuracy: true
    })
  } else {
    emitter.error("geoLocation required!")
  }
}

const serializeCoords = coords => {
  const props = []
  for (let n in coords) {
    props.push(`${n} = ${coords[n]}`)
  }
  return props.join('<br />')
}

const updatePosition = elUpdater("speed")
const handlePositionStream = event => {
  if (event.type === "value") {
    updatePosition(event.value)
  } else if (event.type === "error") {
    console.log(event.value)
  }
}

const geoLocationStream = Kefir.stream(streamGeoLocation)
  .map(position => position.coords)
  .map(serializeCoords)

const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const stopWatchingGeoLocation = () => {
  navigator.geolocation.clearWatch(positionWatcher)
  geoLocationStream.offAny(handlePositionStream)
  positionWatcher = undefined
}
const stopClickStream = Kefir.fromEvents(stopBtn, "click")
stopClickStream
  .onValue(stopWatchingGeoLocation)
  .onValue(displayEl(stopBtn, false))
  .onValue(displayEl(startBtn, true))
  .onValue(()=> sensor.stop())

const startWatchingGeoLocation = () => {
  geoLocationStream.onAny(handlePositionStream)
}
const startClickStream = Kefir.fromEvents(startBtn, "click")
startClickStream
  .onValue(startWatchingGeoLocation)
  .onValue(displayEl(startBtn, false))
  .onValue(displayEl(stopBtn, true))
  .onValue(() => sensor.start())
