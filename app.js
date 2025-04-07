var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
require("./utils/database");
require("./utils/google");
require("./utils/facebook");
const crypto = require("crypto");
const { initWebSocket } = require("./utils/socket");
const http = require("http");
const server = http.createServer(app);

initWebSocket(server);

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static("public/images"));
app.use(express.static(path.join(__dirname, "public")));

// PH_Info_Center
var addInfoCenterRouter = require("./routes/InfoCenter/add");
var getInfoCenterRouter = require("./routes/InfoCenter/get");
var updateInfoCenterRouter = require("./routes/InfoCenter/update");
var deleteInfoCenterRouter = require("./routes/InfoCenter/delete");

// Auth
var SignupRouter = require("./routes/Auth/Signup/Signup");
var LoginRouter = require("./routes/Auth/Login/Login");
var SignupGoogleRouter = require("./routes/Auth/Signup/Google");
var LoginGoogleRouter = require("./routes/Auth/Login/Google");
var SignupFacebookRouter = require("./routes/Auth/Signup/Facebook");
var LoginFacebookRouter = require("./routes/Auth/Login/Facebook");
var RegisterForRoleRouter = require("./routes/Auth/Signup/RegisterForRole");
var RegisterForJobListingRouter = require("./routes/Auth/Signup/RegisterForJobListing");
var EditUserRouter = require("./routes/Auth/Signup/EditUser");

// Contact
var EmailRouter = require("./routes/Contact/Email/Email");
var SupportRouter = require("./routes/Contact/Support/Support");

// Chat
var SendMessageRouter = require("./routes/Chat/sendMessage");
var getMessageRouter = require("./routes/Chat/get");

// Report
var ReportRouter = require("./routes/Report/Report");

// Services Hub
var PropertyViewingRouter = require("./routes/ServicesHub/PropertyViewing/PropertyViewing");
var PropertySearchRouter = require("./routes/ServicesHub/PropertySearch/PropertySearch");

function validateAPIKey(req, res, next) {
  const authkey = req.header("api-key");
  if (
    authkey &&
    crypto.createHash("sha256").update(authkey).digest("hex") ==
      process.env.API_KEY
  ) {
    next();
  } else {
    res.status(401).send(`
      <html>
        <head>
          <title>Unauthorized Access</title>
          <style>
            body {
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .container h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .container p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .container a {
              text-decoration: none;
              color: #007bff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to access this resource.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <p><a href="/">Return to Home</a></p>
          </div>
        </body>
      </html>
    `);
  }
}

app.use((req, res, next) => {
  if (req.path.startsWith("/images")) {
    return next();
  }
  validateAPIKey(req, res, next);
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/api/v1/infoCenter/add", addInfoCenterRouter);
app.use("/api/v1/infoCenter/get", getInfoCenterRouter);
app.use("/api/v1/infoCenter/update", updateInfoCenterRouter);
app.use("/api/v1/infoCenter/delete", deleteInfoCenterRouter);

//Auth
app.use("/api/v1/auth/signup", SignupRouter);
app.use("/api/v1/auth/login", LoginRouter);
app.use("/api/v1/auth/signup/google", SignupGoogleRouter);
app.use("/api/v1/auth/login/google", LoginGoogleRouter);
app.use("/api/v1/auth/signup/facebook", SignupFacebookRouter);
app.use("/api/v1/auth/login/facebook", LoginFacebookRouter);
app.use("/api/v1/auth/signup/registerForRole", RegisterForRoleRouter);
app.use("/api/v1/auth/signup/jobListing", RegisterForJobListingRouter);
app.use("/api/v1/auth/signup/editUser", EditUserRouter);

// Contact
app.use("/api/v1/contact/email", EmailRouter);
app.use("/api/v1/contact/support", SupportRouter);

// Chat
app.use("/api/v1/chat/sendMessage", SendMessageRouter);
app.use("/api/v1/chat/get", getMessageRouter);

// Report
app.use("/api/v1/report", ReportRouter);

// Services Hub
app.use("/api/v1/servicesHub/propertyViewing", PropertyViewingRouter);
app.use("/api/v1/servicesHub/propertySearch", PropertySearchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
