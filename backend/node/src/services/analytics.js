let analytics = {
  totalRequests: 0,
  success: 0,
  failed: 0,
};

function logRequest(success = true) {
  analytics.totalRequests++;
  if (success) analytics.success++;
  else analytics.failed++;
}

function getAnalytics() {
  return analytics;
}

module.exports = { logRequest, getAnalytics };