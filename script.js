console.log("In script.js")

if (navigator && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(`position = ${position}`)
  })
} else {
  console.log("This page requires geolocation services to function!")
}
