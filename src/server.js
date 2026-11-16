const { App } = require("./app");
const { Config } = require("./config/Config");
const { logger } = require("./logs");

try {
  const { app } = new App();
  const port = Config.getInstance().getPort();
  app.listen(port, () => logger.info(`Express server listening on port ${port}`));
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}
