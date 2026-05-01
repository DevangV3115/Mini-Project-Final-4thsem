let history = [];

function addHistory(entry) {
  history.push({
    ...entry,
    timestamp: new Date(),
  });

  // limit history (avoid memory overflow)
  if (history.length > 100) {
    history.shift();
  }
}

function getHistory() {
  return history;
}

module.exports = { addHistory, getHistory };