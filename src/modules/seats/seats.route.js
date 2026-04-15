const express = require("express");
const router = express.Router();

const SeatsController = require("./seats.controller");
const authenticate = require("../auth/auth.middleware");

router.get("/", SeatsController.getAllSeats);

router.get("/my-bookings", authenticate, SeatsController.getMyBookings);

router.put("/:id/book", authenticate, SeatsController.bookSeat);

module.exports = router;
