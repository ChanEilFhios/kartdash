(function (g) {
  let state = {
    "speed": 0,
    "track": [],
    "heading": 0
  }

  const stateObservers = []

  g.app = {
    updateState,
    addStateObserver
  }

  function addStateObserver(fn) {
    stateObservers.push(fn)
  }

  function updateState(newState) {
    state = Object.assign({}, state, newState)
    stateObservers.map(observer => observer(state))
  }
})(window)