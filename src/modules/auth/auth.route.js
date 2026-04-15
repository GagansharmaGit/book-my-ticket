const express = require("express");
const router = express.Router();

const AuthController = require("./auth.controller");
const authenticate = require("./auth.middleware");
const validate = require("../../common/middleware/validate.middleware");
const registerDto = require("./dto/register.dto");
const loginDto = require("./dto/login.dto");

router.post("/register", validate(registerDto), AuthController.register);

router.post("/login", validate(loginDto), AuthController.login);

router.get("/me", authenticate, AuthController.getMe);

module.exports = router;
