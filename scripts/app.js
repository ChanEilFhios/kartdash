const speedSpan = document.getElementById("speed")
const orientationSpan = document.getElementById("orientation")
const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

let positionWatcher

const serializeCoords = coords => {
  const props = []
  for (let n in coords) {
      props.push(`${n} = ${coords[n]}`)
  }
	return props.join('<br />')
}

const updatePosition = position => {
  speedSpan.innerHTML = serializeCoords(position.coords)
}

const handleError = error => {
  console.log("Error from watchPosition", error)
}

const sensor = new AbsoluteOrientationSensor()
sensor.addEventListener('reading', function(e) {
  const q = e.target.quaternion
  let heading = Math.round(Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI))
  if (heading < 0) heading += 360
  
  orientationSpan.innerHTML = `${heading} degrees`
})

const stopWatching = () => {
  stopBtn.style.display = "none"
  startBtn.style.display = "block"

  navigator.geolocation.clearWatch(positionWatcher)
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
