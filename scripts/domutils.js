
export const elUpdater = id => {
  const el = document.getElementById(id)
  return (text) => el.innerHTML = text
}

export const setElStyle = (el, attr, value) => el.style[attr] = value
export const showElIfTrue = el => value => setElStyle(el, "display", value ? "block" : "none")
export const showElIfFalse = el => value => setElStyle(el, "display", !value ? "block" : "none")

export const gaugeUpdater = id => {
  const gauge = document.getElementById(id)
  return (value) => gauge.setAttribute("data-value", value)
}
