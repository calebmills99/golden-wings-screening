function log(message, ...meta) {
  console.log(`[golden-wings] ${message}`, ...meta);
}

function error(message, ...meta) {
  console.error(`[golden-wings] ${message}`, ...meta);
}

module.exports = {
  log,
  error
};
