const Sentry = require("@sentry/node");

function initSentry({
  dsn,
  env = process.env.NODE_ENV,
  release,
  extraOptions = {},
}) {
  Sentry.init({
    dsn,
    environment: env,
    release,
    ...extraOptions,
  });

  // --- Capture unhandled errors automatically ---
  process.on("uncaughtException", (err) => {
    Sentry.captureException(err);
    Sentry.flush(2000).finally(() => process.exit(1));
  });

  process.on("unhandledRejection", (reason) => {
    Sentry.captureException(reason);
    Sentry.flush(2000).finally(() => process.exit(1));
  });

  console.log("Sentry ianc with DSN:", dsn);

  return Sentry;
}

function captureError(err, context = {}) {
  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([k, v]) => scope.setExtra(k, v));
    Sentry.captureException(err);
  });
}

module.exports = { initSentry, captureError };
