const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AuthModel = require("./auth.model");
const ApiError = require("../../common/utils/api-error");

const SALT_ROUNDS = 10;

const AuthService = {
  async register({ username, email, password }) {
    const existingEmail = await AuthModel.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const existingUsername = await AuthModel.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(409, "This username is already taken");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await AuthModel.create({ username, email, passwordHash });
    return user;
  },

  async login({ email, password }) {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  },
};

module.exports = AuthService;
