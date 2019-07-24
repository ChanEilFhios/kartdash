const speedSpan = document.getElementById("speed")
const orientationSpan = document.getElementById("orientation")

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

const handleError = error => console.log("Error from watchPosition", error)

if (navigator && navigator.geolocation) {
  positionWatcher = navigator.geolocation.watchPosition(updatePosition, handleError, {
    enabledHighAccuracy: true
  })
} else {
  console.log("This page requires geolocation services to function!")
}

const sensor = new AbsoluteOrientationSensor()
sensor.addEventListener('reading', function(e) {
  const q = e.target.quaternion
  let heading = Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI)
  if(heading < 0) heading = 360+heading;

  orientationSpan.innerHTML = `${heading} degrees`
})
sensor.start()
