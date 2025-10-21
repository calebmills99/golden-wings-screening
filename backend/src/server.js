const app = require('./app');
const { config } = require('./config/env');
const { log } = require('./utils/logger');

function startServer() {
  const port = config.port;
  app.listen(port, () => {
    log(`API ready on port ${port}`);
  });
}

startServer();
