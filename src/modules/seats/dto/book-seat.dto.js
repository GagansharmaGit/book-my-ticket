const BaseDto = require("../../../common/dto/base.dto");

// Seat ID comes from URL params (:id), not body — this DTO is minimal
// It can be extended later (e.g., for choosing a time slot)
const bookSeatDto = new BaseDto({});

module.exports = bookSeatDto;
