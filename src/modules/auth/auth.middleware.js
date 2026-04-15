const jwt = require("jsonwebtoken");
const ApiError = require("../../common/utils/api-error");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "No token provided. Please login to continue.")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired. Please login again."));
    }
    return next(new ApiError(401, "Invalid token. Please login again."));
  }
};

module.exports = authenticate;
