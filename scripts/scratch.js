import {
  createNewAbsOrientationStream,
  calcHeadingFromQuaternion,
  normalizeHeading
} from './absorientationstream.js'

import {
  createGeoLocationStream,
  extractSpeed,
  serializeCoords
} from './geolocationstream.js'

import {
  elUpdater,
  displayEl
} from './domutils.js'

const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const orientationStream = createNewAbsOrientationStream()
  .map(calcHeadingFromQuaternion)
  .map(normalizeHeading)

const decorateHeading = heading => `${heading} degrees`
const orientationDisplayStream = orientationStream
  .map(decorateHeading)

const rawGeoLocationStream = createGeoLocationStream({ enabledHighAccuracy: true })

const speedGeoStream = rawGeoLocationStream
  .map(extractSpeed)
  .filter(speed => speed === null)

const geoLocationDisplayStream = rawGeoLocationStream
  .map(serializeCoords)

const updateOrientation = elUpdater("orientation") 
const stopWatchingOrientation = () => orientationDisplayStream.offValue(updateOrientation)
const startWatchingOrientation = () => orientationDisplayStream.onValue(updateOrientation)

const updateGeoLocation = elUpdater("geolocation")
const stopWatchingGeoLocation = () => geoLocationDisplayStream.offValue(updateGeoLocation)
const startWatchingGeoLocation = () => geoLocationDisplayStream.onValue(updateGeoLocation)

const updateSpeed = elUpdater("speed")
const stopWatchingSpeed = () => speedGeoStream.offValue(updateSpeed)
const startWatchingSpeed = () => speedGeoStream.onValue(updateSpeed)

const monitorSensorStream = Kefir.fromEvents(stopBtn, "click")
  .map(()=> false)
  .merge(Kefir.fromEvents(startBtn, "click")
    .map(() => true))

monitorSensorStream
  .onValue((monitor) => displayEl(startBtn, !monitor))
  .onValue((monitor) => displayEl(stopBtn, monitor))
  .onValue((monitor) => {
    if (monitor) {
      startWatchingOrientation
      startWatchingGeoLocation
      startWatchingSpeed
    } else {
      stopWatchingOrientation
      stopWatchingGeoLocation
      stopWatchingSpeed
    }
  })
