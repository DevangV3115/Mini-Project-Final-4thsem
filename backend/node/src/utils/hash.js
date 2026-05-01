const crypto = require("crypto");

function generateHash(input) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
}

module.exports = { generateHash };