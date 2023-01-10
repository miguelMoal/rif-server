const { Router } = require("express");
const { JWTValidate } = require("../meddlewares/JWTValidate");

const { buyTicket, getMyTickets } = require("../controllers/Ticket.controller");

const router = Router();

router.use(JWTValidate);

router.get("/", getMyTickets);
router.post("/buyTicket", buyTicket);

module.exports = router;
