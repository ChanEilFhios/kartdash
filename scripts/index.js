import {
  createNewAbsOrientationStream,
  normalizeHeading
} from './absorientationstream.js'

import {
  createGeoLocationStream,
  extractSpeed,
  serializeCoords,
  calcSpeedFromLocations
} from './geolocationstream.js'

import {
  elUpdater,
  showElIfTrue,
  showElIfFalse
} from './domutils.js'

import {
  subscribeIfTrue
} from './streamutils.js'

import {
  calcHeadingFromQuaternion
} from './trigutils.js'

const track = []

const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const orientationStream = createNewAbsOrientationStream()
  .map(calcHeadingFromQuaternion)
  .map(normalizeHeading)

const decorateHeading = heading => `${heading} degrees`
const orientationDisplayStream = orientationStream
  .map(decorateHeading)

const rawGeoLocationStream = createGeoLocationStream({ enabledHighAccuracy: true })

const geoLocationDisplayStream = rawGeoLocationStream
  .map(serializeCoords)

const calcSpeedStream = rawGeoLocationStream
  .filter((position) => position.coords.speed === null)
  .slidingWindow(2, 2)
  .map(calcSpeedFromLocations)

const speedGeoStream = rawGeoLocationStream
  .map(extractSpeed)
  .filter(speed => speed !== null)

const speedDisplayStream = speedGeoStream
  .merge(calcSpeedStream)
  .map((speed) => speed * 2.237)
  .map(Math.round)
  .map((speed) => `${speed} mph`)
  
const sensorControlStream = Kefir.fromEvents(stopBtn, "click")
  .map(() => false)
  .merge(Kefir.fromEvents(startBtn, "click")
  .map(() => true))

const updateOrientation = elUpdater("orientation") 
const updateGeoLocation = elUpdater("geolocation")
const updateSpeed = elUpdater("speed")
const recordTrack = position => track.push(position)

sensorControlStream
  .onValue(showElIfTrue(stopBtn))
  .onValue(showElIfFalse(startBtn))
  .onValue(subscribeIfTrue(orientationDisplayStream, updateOrientation))
  .onValue(subscribeIfTrue(geoLocationDisplayStream, updateGeoLocation))
  .onValue(subscribeIfTrue(speedDisplayStream, updateSpeed))
  .onValue(subscribeIfTrue(rawGeoLocationStream, recordTrack))