const speedSpan = document.getElementById("speed")

if (navigator && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    speedSpan.innerHTML = JSON.stringify(position.coords, null, 2)
  })
} else {
  console.log("This page requires geolocation services to function!")
}
