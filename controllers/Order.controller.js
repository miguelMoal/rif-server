const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const async = require("async");

const getOrders = async (req, res) => {
  const orders = await Order.find({ available: true });
  res.status(200).json({
    ok: true,
    msg: orders,
  });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.uid });
  res.status(200).json({
    ok: true,
    data: orders,
  });
};

const createOrder = async (req, res) => {
  const { name, description, dateInit, dateEnd, price } = req.body;
  const parsePrice = parseFloat(price);
  const order = new Order({
    name,
    description,
    dateInit,
    dateEnd,
    price: parsePrice,
  });

  try {
    order.user = req.uid;
    order.createdAt = new Date();
    const orderDB = await order.save();
    res.status(200).json({
      ok: true,
      data: orderDB,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Order could not be created",
    });
  }
};

const uploadImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.images) {
    res.status(400).json({
      ok: false,
      msg: "No ha seleccionado una imagen",
    });
    return;
  }

  const { images } = req.files;

  const imagesURL = [];

  async.forEach(
    images,
    (file, callback) => {
      console.log(file);
      const splitName = file.name.split(".");
      const extension = splitName[splitName.length - 1];

      const validExtensions = ["png", "jpg", "jpeg", "PNG"];
      if (!validExtensions.includes(extension)) {
        return res.status(400).json({ ok: false, msg: "Archivo invalido" });
      }

      const nameTemp = uuidv4() + "." + extension;

      // Crea una instancia de Storage
      const storage = new Storage();

      // Selecciona el contenedor de almacenamiento y el archivo que deseas subir
      const bucket = storage.bucket("rif-app");
      const fileB = bucket.file(nameTemp);

      // Crea un stream de lectura del archivo local que deseas subir
      const fileStream = fs.createReadStream(file.tempFilePath);

      // Usa el método createWriteStream para subir el archivo
      fileStream
        .pipe(
          fileB.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
            resumable: false,
          })
        )
        .on("error", (err) => {
          console.log(err);
          res.status(400).json({ ok: false, msg: "Failed to upload images" });
        })
        .on("finish", async () => {
          storage
            .bucket("rif-app")
            .file(nameTemp)
            .getSignedUrl(
              {
                action: "read",
                expires: "03-09-2491",
                virtualHostedStyle: true,
              },
              (err, url) => {
                if (err) {
                  console.log(err);
                  callback(err);
                } else {
                  imagesURL.push(url);
                  callback();
                }
              }
            );
        });
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        Order.findByIdAndUpdate(
          { _id: "63a10c4aead1ae91212d08e5" },
          { $push: { images: { $each: imagesURL } } },
          { new: true },
          (err, doc) => {
            if (err) {
              res
                .status(400)
                .json({ ok: false, msg: "Failed to save images in db" });
            } else {
              res.status(200).json({ ok: false, msg: doc });
            }
          }
        );
      }
    }
  );
};

module.exports = {
  getOrders,
  createOrder,
  uploadImage,
  getMyOrders,
};
