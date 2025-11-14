const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const db = require("./database").mongoURI;

require("dotenv").config();
mongoose.set("strictQuery", false);
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("secretKey", "sedapbkkbn"); // jwt secret token

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Cross Origin
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use("/repo", express.static(path.join(__dirname, 'repo')));

app.get("/", (req, res) => {
  res.send("Goods Services");
});

//Router
const lostFoundRoute = require("./routes/LostFoundRoutes");
const goodsComplaintRoute = require("./routes/GoodsComplaintRoutes");
const goodsRelocationRoute = require("./routes/GoodsRelocationRoutes");
const goodsRemoveRoute = require("./routes/GoodsRemoveRoutes");
const goodsLoanReturn = require("./routes/GoodsLoanReturnRoutes");
const dashboardRoutes = require("./routes/Dashboard");
const scheduleDailyUpdate = require("./controller/UpdateFoundStatus");

const identificationRoute = require("./routes/IdentificationRoutes");
const locationRoute = require("./routes/LocationRoutes");
const itemsRoute = require("./routes/ItemsRoutes");

app.use("/lostFound", lostFoundRoute);
app.use("/goodsComplaint", goodsComplaintRoute);
app.use("/goodsRelocation", goodsRelocationRoute);
app.use("/goodsRemove", goodsRemoveRoute);
app.use("/goodsLoanReturn", goodsLoanReturn);
app.use("/dashboard", dashboardRoutes);

app.use("/indetification", identificationRoute);
app.use("/location", locationRoute);
app.use("/items", itemsRoute);

// Mulai jadwal update status
scheduleDailyUpdate();

const PORT = process.env.PORT || 2050;
app.listen(PORT, () => {
  console.log(`Server Goods Run on PORT ${PORT}`);
});

//versi baru
