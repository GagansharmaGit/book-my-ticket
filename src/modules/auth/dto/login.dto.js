const BaseDto = require("../../../common/dto/base.dto");

const loginDto = new BaseDto({
  email: { required: true, type: "email" },
  password: { required: true },
});

module.exports = loginDto;
