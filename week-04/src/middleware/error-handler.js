module.exports = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: {
      message: err.message,
      statusCode: 500
    },
    timestamp: new Date()
  });
};