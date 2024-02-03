const express = require("express");
const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js");
const database = require("./config/database.js");
const systemCofig = require("./config/system.js");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extends : false}));

database.connect();

// Link with pug
app.set("views", "./views");
app.set("view engine", "pug");

// Flash
app.use(cookieParser("02062003"));
app.use(session({ cookie: {maxAge: 60000} }));
app.use(flash());
// End Flash

// App local variables
app.locals.prefixAdmin = systemCofig.prefixAdmin;

app.use(express.static("public"));

// routes
route(app);
routeAdmin(app);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); 

// check process run in port and kill them
// lsof -i :port
// kill -9 <PID>

// start mongodb
// sudo service mongod start