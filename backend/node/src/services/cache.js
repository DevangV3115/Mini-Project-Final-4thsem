const cache = new Map();

// simple in-memory cache (no dependency issues)
function getCache(key) {
  return cache.get(key);
}

function setCache(key, value) {
  cache.set(key, value);

  // auto-expire after 5 min
  setTimeout(() => {
    cache.delete(key);
  }, 5 * 60 * 1000);
}

module.exports = { getCache, setCache };