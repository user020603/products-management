const express = require("express");
const route = require("./routes/client/index.route.js");
require("dotenv").config();
const database = require("./config/database.js");

const app = express();
const port = process.env.PORT;


database.connect();

// Link with pug
app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// routes
route(app);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 

// check process run in port and kill them
// lsof -i :port
// kill -9 <PID>

// start mongodb
// sudo service mongod start