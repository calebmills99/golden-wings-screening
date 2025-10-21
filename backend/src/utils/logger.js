const timestamp = () => new Date().toISOString();

const log = (level, message, meta) => {
  const payload = {
    level,
    message,
    timestamp: timestamp(),
    ...(meta ? { meta } : {}),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
};

export const logger = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
};
