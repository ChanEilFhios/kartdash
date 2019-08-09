import {createNewAbsOrientationStream} from './absorientationstream.js'

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

const orientationStream = createNewAbsOrientationStream()
  .map(e => e.target.quaternion)
  .map(calcHeadingFromQuaternion)
  .map(normalizeHeading)

orientationStream
  .map(decorateHeading)

const streamGeoLocation = emitter => {
  if (navigator && navigator.geolocation) {
    const positionWatcher = navigator.geolocation.watchPosition(emitter.value, emitter.error, {enabledHighAccuracy: true})

    return () => navigator.geolocation.clearWatch(positionWatcher)
  } else {
    emitter.error("geoLocation required!")
  }
}

const serializeCoords = position => {
  const props = [`timestamp = ${position.timestamp}`]
  const coords = position.coords
  for (let n in coords) {
    props.push(`${n} = ${coords[n]}`)
  }
  return props.join('<br />')
}

const updateGeoLocation = elUpdater("geolocation")
const handleGeoLocationStream = event => {
  if (event.type === "value") {
    updateGeoLocation(event.value)
  } else if (event.type === "error") {
    console.log(event.value)
  }
}

const rawGeoLocationStream = Kefir.stream(streamGeoLocation)

const updateSpeed = elUpdater("speed")
const speedGeoStream = rawGeoLocationStream
  .filter(position => position.coords.speed === null)
  .map(position => position.coords.speed)
speedGeoStream.onValue(updateSpeed)

const geoLocationStream = rawGeoLocationStream
  .map(serializeCoords)

const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const stopWatchingOrientation = () => orientationStream.offValue(updateOrientation)
const startWatchingOrientation = () => orientationStream.onValue(updateOrientation)

const stopWatchingGeoLocation = () => {
  geoLocationStream.offAny(handleGeoLocationStream)
}
const stopClickStream = Kefir.fromEvents(stopBtn, "click")
stopClickStream
  .onValue(stopWatchingGeoLocation)
  .onValue(displayEl(stopBtn, false))
  .onValue(displayEl(startBtn, true))
  .onValue(stopWatchingOrientation)

const startWatchingGeoLocation = () => {
  geoLocationStream.onAny(handleGeoLocationStream)
}
const startClickStream = Kefir.fromEvents(startBtn, "click")
startClickStream
  .onValue(startWatchingGeoLocation)
  .onValue(displayEl(startBtn, false))
  .onValue(displayEl(stopBtn, true))
  .onValue(startWatchingOrientation)
