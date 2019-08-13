export const degToRad = deg => deg * Math.PI / 180
export const radToDeg = deg => deg * 180 / Math.PI
export const calcHeadingFromQuaternion = ({ quaternion: q }) => radToDeg(Math.round(Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2])))
