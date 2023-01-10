const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");
const fileUpload = require("express-fileupload");

const app = express();

//BASE DE DATOS
dbConnection();

app.use(cors());

app.use(express.static("public"));
app.use("/uploads", express.static(`${__dirname}/uploads`));

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/auth", require("./routes/Auth.router"));
app.use("/api/events", require("./routes/Product.router"));
app.use("/api/orders", require("./routes/Order.router"));
app.use("/api/payment", require("./routes/Payment.router"));
app.use("/api/tickets", require("./routes/Ticket.router"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});
