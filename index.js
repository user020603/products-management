const express = require("express");
const path = require("path");
const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js");
const database = require("./config/database.js");
const systemCofig = require("./config/system.js");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const app = express();
const port = process.env.PORT;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extends: false }));

database.connect();

// Link with pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser("02062003"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// App local variables
app.locals.prefixAdmin = systemCofig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// routes
route(app);
routeAdmin(app);

// 404 Not Found
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
  // res.redirect("/");
});

// Start the server
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// check process run in port and kill them
// lsof -i :port
// kill -9 <PID>

// start mongodb
// sudo service mongod start
