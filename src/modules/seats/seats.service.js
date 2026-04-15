const SeatsModel = require("./seats.model");
const ApiError = require("../../common/utils/api-error");

const SeatsService = {
  async getAllSeats() {
    return await SeatsModel.getAllSeats();
  },

  async bookSeat(seatId, userId, username) {
    if (!Number.isInteger(seatId) || seatId <= 0) {
      throw new ApiError(400, "Seat ID must be a positive integer");
    }

    const result = await SeatsModel.bookSeat(seatId, userId, username);

    if (!result.success) {
      throw new ApiError(409, result.reason);
    }

    return result.seat;
  },

  async getMyBookings(userId) {
    return await SeatsModel.getUserBookings(userId);
  },
};

module.exports = SeatsService;
