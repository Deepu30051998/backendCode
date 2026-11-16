function errorHandler(err, req, res, next) {
  const status = err.status || err.httpCode || 500;
  if (req.accepts("html") && !req.path.startsWith("/api")) {
    return res.status(status).send(`<h2>Error (${status})</h2><p>${err.message}</p>`);
  }
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = { errorHandler };

