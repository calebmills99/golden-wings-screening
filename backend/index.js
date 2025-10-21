require('dotenv').config();

const createServer = require('./server');

const port = Number(process.env.PORT || 4000);

(async () => {
  try {
    const app = await createServer();
    app.listen(port, () => {
      console.log(`Golden Wings backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start Golden Wings backend', error);
    process.exit(1);
  }
})();
