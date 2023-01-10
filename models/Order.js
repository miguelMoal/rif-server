const { Schema, model } = require("mongoose");

const OrderSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateInit: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  participants: [
    {
      participatId: Schema.Types.ObjectId,
      name: String,
      email: String,
      phone: String,
    },
  ],
  winner: {
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Order", OrderSchema);
