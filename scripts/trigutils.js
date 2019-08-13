export const degToRad = deg => deg * Math.PI / 180
export const radToDeg = deg => deg * 180 / Math.PI
export const calcHeadingFromQuaternion = ({ quaternion: q }) => radToDeg(Math.round(Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2])))
export const haversine = (start, end) => {
  const dLat = degToRad(end.latitude - start.latitude)
  const dLon = degToRad(end.longitude - start.longitude)
  const lat1 = degToRad(start.latitude)
  const lat2 = degToRad(end.latitude)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return 6372800 * c
}