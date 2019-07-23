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

const updateOrientation = e => {
  const propNames = ["absolute", "alpha", "beta", "gamma"]
  
  orientationSpan.innerHTML = propNames.reduce((coll, propName) => {
    coll.push(`${propName`} = ${e[propName]})
    return coll
  }, []).join('<br />')
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

window.addEventListener("deviceorientation", updateOrientation)
