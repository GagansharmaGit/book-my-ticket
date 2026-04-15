const SeatsService = require("./seats.service");
const ApiResponse = require("../../common/utils/api-response");
const ApiError = require("../../common/utils/api-error");

const SeatsController = {
  async getAllSeats(req, res, next) {
    try {
      const seats = await SeatsService.getAllSeats();
      res
        .status(200)
        .json(new ApiResponse(200, seats, "Seats fetched successfully"));
    } catch (error) {
      next(error);
    }
  },

  async bookSeat(req, res, next) {
    try {
      const seatId = parseInt(req.params.id, 10);
      if (isNaN(seatId)) {
        return next(new ApiError(400, "Seat ID must be a valid number"));
      }

      const { userId, username } = req.user;
      const seat = await SeatsService.bookSeat(seatId, userId, username);

      res
        .status(200)
        .json(new ApiResponse(200, seat, `Seat ${seatId} booked successfully`));
    } catch (error) {
      next(error);
    }
  },

  async getMyBookings(req, res, next) {
    try {
      const { userId } = req.user;
      const bookings = await SeatsService.getMyBookings(userId);
      res
        .status(200)
        .json(
          new ApiResponse(200, bookings, "Your bookings fetched successfully")
        );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = SeatsController;
