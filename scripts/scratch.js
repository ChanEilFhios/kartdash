const speedSpan = document.getElementById("speed")
const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const elUpdater = id => {
  const el = document.getElementById(id)
  return (text) => el.innerHTML = text
}

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

const serializeCoords = coords => {
  const props = []
  for (let n in coords) {
    props.push(`${n} = ${coords[n]}`)
  }
  return props.join('<br />')
}

const updatePosition = position => speedSpan.innerHTML = serializeCoords(position.coords)

const handleError = error => {
  console.log("Error from watchPosition", error)
}

const stopWatching = () => {
  stopBtn.style.display = "none"
  startBtn.style.display = "block"

  navigator.geolocation.clearWatch(positionWatcher)
  positionWatcher = undefined
  sensor.stop()
}

const startWatching = () => {
  stopBtn.style.display = "block"
  startBtn.style.display = "none"

  sensor.start()

  if (navigator && navigator.geolocation) {
    positionWatcher = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enabledHighAccuracy: true
    })
  } else {
    console.log("This page requires geolocation services to function!")
  }
}

stopBtn.addEventListener("click", stopWatching)
startBtn.addEventListener("click", startWatching)
