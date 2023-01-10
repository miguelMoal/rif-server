const { Router } = require("express");
const { JWTValidate } = require("../meddlewares/JWTValidate");

const { payment, refound } = require("../controllers/Payment.controller");

const router = Router();

router.use(JWTValidate);

router.post("/", payment);
router.post("/refound", refound);

module.exports = router;
