const User = require("../models/User");
const Order = require("../models/Order");

const buyTicket = async (req, res) => {
  const user = await User.findById(req.uid).select("-password");
  const raffle = await Order.findById(req.body.orderId);
  const { name, email, phone } = user;

  try {
    if (!raffle || !raffle.available) {
      return res.status(404).json({
        ok: false,
        msg: "Order not available",
        data: null,
      });
    }

    raffle.participants.push({ name, email, phone, participatId: req.uid });
    await raffle.save();

    res.status(200).json({
      ok: true,
      data: raffle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
      data: null,
    });
  }
};

const getMyTickets = async (req, res) => {
  const orders = await Order.find({ "participants.participatId": req.uid });
  res.status(200).json({
    ok: true,
    data: orders,
  });
};

module.exports = {
  buyTicket,
  getMyTickets,
};
