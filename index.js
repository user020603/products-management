const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

const route = require("./routes/client/index.route.js");

// Link with pug
app.set("views", "./views");
app.set("view engine", "pug");

// route
route(app);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 

// check process run in port and kill them
// lsof -i : port
// kill -9 <PID>

// start mongodb
// sudo service mongod start