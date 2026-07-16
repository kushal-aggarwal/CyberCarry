const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose
  .connect(process.env.MONGODB_URI || config.get("MONGODB_URI"))
  .then(function () {
    dbgr("connected");
    console.log("MongoDB Connected");
  })
  .catch(function (err) {
    console.error("MONGODB CONNECTION ERROR: ");
    console.error(err);
  });

module.exports = mongoose.connection;