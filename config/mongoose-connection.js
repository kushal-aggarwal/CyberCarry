const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose
.connect(config.get("MONGODB_URI"))
.then(function() {
    dbgr("connected");
})
.catch(function(err) {
    dbgr(err);
})

module.exports = mongoose.connection;