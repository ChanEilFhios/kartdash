const speedSpan = document.getElementById("speed")

const serializeCoords = coords => {
  const props = []
  for (let n in coords) {
      props.push(`${n} = ${coords[n]}`)
  }
	return props.join('\n')
}

if (navigator && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    speedSpan.innerHTML = serializeCoords(position.coords)
  })
} else {
  console.log("This page requires geolocation services to function!")
}
