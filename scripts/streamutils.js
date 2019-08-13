export const subscribeIfTrue = (obss, fn) => value => value ? obss.onValue(fn) : obss.offValue(fn)
