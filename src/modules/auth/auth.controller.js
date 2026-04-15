const AuthService = require("./auth.service");
const ApiResponse = require("../../common/utils/api-response");

const AuthController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await AuthService.register({ username, email, password });
      res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json(new ApiResponse(200, result, "Login successful"));
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      res
        .status(200)
        .json(new ApiResponse(200, req.user, "User profile fetched"));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
