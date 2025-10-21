const { createApp } = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');
const { ensureSchema } = require('./src/models/rsvpModel');

async function bootstrap() {
  try {
    await ensureSchema();
    const app = createApp();
    app.listen(env.port, () => {
      logger.info({ port: env.port }, 'Golden Wings API listening');
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to bootstrap Golden Wings API');
    process.exit(1);
  }
}

bootstrap();
