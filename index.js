const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

// body-parser setup

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// routes setup
const matchesRoute = require("./routes/matches");
const delRoute = require("./routes/deliveries");
app.use("/api/matches", matchesRoute);
app.use("/api/deliveries", delRoute);

// listen app on port
app.listen(PORT, () => console.log(`App Running on port ${PORT}`));
