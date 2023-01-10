const { Router } = require("express");
const { JWTValidate } = require("../meddlewares/JWTValidate");
const { check } = require("express-validator");
const { fieldValidator } = require("../meddlewares/fieldValidator");

const {
  getOrders,
  createOrder,
  uploadImage,
  getMyOrders,
} = require("../controllers/Order.controller");

const router = Router();

router.use(JWTValidate);

router.get("/", getOrders);
router.get("/getMyOrders", getMyOrders);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("dateInit", "Invalid Timestamp").isInt({ min: 10 }),
    check("dateEnd", "Invalid Timestamp").isInt({ min: 10 }),
    check("price", "Price is required").not().isEmpty(),
    fieldValidator,
  ],
  createOrder
);
router.post("/upLoadImage", uploadImage);

module.exports = router;
