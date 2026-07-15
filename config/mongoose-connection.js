const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoURI = process.env.MONGODB_URI || config.get("MONGODB_URI");

mongoose
  .connect(mongoURI)
  .then(() => {
    dbgr("connected");
  })
  .catch((err) => {
    dbgr(err);
  });

module.exports = mongoose.connection;