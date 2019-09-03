import {
  createNewAbsOrientationStream,
  normalizeHeading
} from './absorientationstream.js'

import {
  createNewLinAccelerationStream,
} from './linaccelerationstream.js'

import {
  createGeoLocationStream,
  extractSpeed,
  calcSpeedFromLocations
} from './geolocationstream.js'

import {
  showElIfTrue,
  showElIfFalse,
  gaugeUpdater
} from './domutils.js'

import {
  subscribeIfTrue
} from './streamutils.js'

import {
  calcHeadingFromQuaternion
} from './trigutils.js'

const track = []

export const printTrack = () => {
  console.log(track)
}

const stopBtn = document.getElementById("stop")
const startBtn = document.getElementById("start")

const accelerationStream = createNewLinAccelerationStream({referenceFrame: "screen"})

const orientationStream = createNewAbsOrientationStream({ referenceFrame: "screen" })
  .map(calcHeadingFromQuaternion)
  .map(normalizeHeading)

const rawGeoLocationStream = createGeoLocationStream({ enabledHighAccuracy: true })

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
  
const sensorControlStream = Kefir.fromEvents(stopBtn, "click")
  .map(() => false)
  .merge(Kefir.fromEvents(startBtn, "click")
  .map(() => true))

const updateOrientation = gaugeUpdater("orientationgauge")
const updateXAccel = gaugeUpdater("xgauge")
const updateYAccel = gaugeUpdater("ygauge")
const updateZAccel = gaugeUpdater("zgauge")
const updateAcceleration = accelerations => {
  updateXAccel(accelerations.x)
  updateYAccel(accelerations.y)
  updateZAccel(accelerations.z)
}
const updateSpeed = gaugeUpdater("speedgauge")
const recordTrack = position => track.push(position)

sensorControlStream
  .onValue(showElIfTrue(stopBtn))
  .onValue(showElIfFalse(startBtn))
  .onValue(subscribeIfTrue(orientationStream, updateOrientation))
  .onValue(subscribeIfTrue(accelerationStream, updateAcceleration))
  .onValue(subscribeIfTrue(speedDisplayStream, updateSpeed))
  .onValue(subscribeIfTrue(rawGeoLocationStream, recordTrack))