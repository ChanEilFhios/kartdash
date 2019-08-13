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
  showElIfTrue,
  showElIfFalse
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

const updateGeoLocation = elUpdater("geolocation")
const stopWatchingGeoLocation = () => geoLocationDisplayStream.offValue(updateGeoLocation)
const startWatchingGeoLocation = () => geoLocationDisplayStream.onValue(updateGeoLocation)

const updateSpeed = elUpdater("speed")
const stopWatchingSpeed = () => speedGeoStream.offValue(updateSpeed)
const startWatchingSpeed = () => speedGeoStream.onValue(updateSpeed)

const subscribeIfTrue = (obss, fn) => value => value ? obss.onValue(fn) : obss.offValue(fn)

const stopClickStream = Kefir.fromEvents(stopBtn, "click")
  .map(() => false)
stopClickStream
  .onValue(stopWatchingGeoLocation)
  .onValue(stopWatchingSpeed)

const startClickStream = Kefir.fromEvents(startBtn, "click")
  .map(() => true)
startClickStream
.onValue(startWatchingGeoLocation)
.onValue(startWatchingSpeed)

const sensorControlStream = stopClickStream.merge(startClickStream)
sensorControlStream
  .onValue(showElIfTrue(stopBtn))
  .onValue(showElIfFalse(startBtn))
  .onValue(subscribeIfTrue(orientationDisplayStream, updateOrientation))