const BaseDto = require("../../../common/dto/base.dto");

const registerDto = new BaseDto({
  username: { required: true, minLength: 3, maxLength: 50 },
  email: { required: true, type: "email" },
  password: { required: true, minLength: 6 },
});

module.exports = registerDto;
