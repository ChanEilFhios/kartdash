if (navigator && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    alert(`position = ${position}`)
  })
} else {
  alert("This page requires geolocation services to function!")
}
