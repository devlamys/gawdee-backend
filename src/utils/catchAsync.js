const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (typeof next === "function") {
        return next(error);
      }

      console.error("catchAsync error:", error);

      if (res && typeof res.status === "function") {
        return res.status(error.statusCode || error.status || 500).json({
          status: error.statusCode || error.status || 500,
          message: error.message || "Internal server error",
          data: null,
        });
      }

      throw error;
    }
  };
};

export default catchAsync;