const Product = require("../models/Product");

const getProducts = async (req, res) => {
  //console.log(req.uid);
  const products = await Product.find({ user: req.uid });

  res.status(200).json({
    ok: true,
    msg: products,
  });
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);

  try {
    product.user = req.uid;
    const productDB = await product.save();
    res.status(200).json({
      ok: true,
      product: productDB,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "product could not be created",
    });
  }
};

const updateProduct = async (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "updateEvet",
  });
};

const deleteProduct = async (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "deleteEvent",
  });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
