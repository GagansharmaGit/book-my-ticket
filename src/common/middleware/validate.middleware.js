const ApiError = require("../utils/api-error");

const validate = (dto) => (req, res, next) => {
  const errors = dto.validate(req.body);
  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }
  next();
};

module.exports = validate;
