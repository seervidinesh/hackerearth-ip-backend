const mongoose = require("mongoose");
const matchesSchema = require("./modal/Matches");
const deliveriesSchema = require("./modal/Deliveries");

const csv = require("csvtojson");
const csvFilePath = "./csv/matches.csv";
const csvFilePathDelivries = "./csv/deliveries.csv";

// connect mongodb database
var connection = mongoose.createConnection("mongodb://localhost:27017/iplApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// create schema
var Matches = connection.model("matches", matchesSchema);
var Deliveries = connection.model("deliveries", deliveriesSchema);

// dump csv Matches data to mongodb Matches Schema
connection.once("open", async () => {
  if ((await Matches.countDocuments().exec()) > 0) return;
  Promise.all([
    csv()
      .fromFile(csvFilePath)
      .then(jsonObj => {
        var matchData = jsonObj.filter(item => item.id !== "id");
        Matches.insertMany(matchData)
          .then(res => console.log("Matches Data Added to Matches Schema"))
          .catch(err => console.log(err));
      })
  ])
    .then(() => console.log("Matches data added to mongodb"))
    .catch(err => console.log(err));
});

// dump csv Deliveries data to mongodb Deliveries Schema

connection.once("open", async () => {
  if ((await Deliveries.countDocuments().exec()) > 0) return;
  Promise.all([
    csv()
      .fromFile(csvFilePathDelivries)
      .then(jsonObj => {
        var delivryData = jsonObj.filter(item => item.id !== "id");
        Deliveries.insertMany(delivryData)
          .then(res => console.log("Delivries Data Added to Delivries Schema"))
          .catch(err => console.log(err));
      })
  ])
    .then(() => console.log("Delivery data added to mongodb"))
    .catch(err => console.log(err));
});

// export schema
module.exports = {
  Matches,
  Deliveries
};
