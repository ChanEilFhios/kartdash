
export const elUpdater = id => {
  const el = document.getElementById(id)
  return (text) => el.innerHTML = text
}

export const setElStyle = (el, attr, value) => el.style[attr] = value
export const showElIfTrue = el => value => setElStyle(el, "display", value ? "block" : "none")
export const hideElIfFalse = el => value => setElStyle(el, "display", !value ? "block" : "none")
export const displayEl = (el, show) => setElStyle(el, "display", show ? "block" : "none")
