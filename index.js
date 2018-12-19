const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const app = express();
const logger = require("./middleware/logger");
const auth = require("./authentication");
const courses = require("./routes/courses");
const home = require("./routes/home");

app.set("view engine", "pug");

//Find the current env we are working in
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get("env")}`);

app.use(helmet()); // securing apps with different headers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // used to send key value parts in the body of the request
app.use(express.static("public"));
app.use(logger);

//Router
app.use("/api/courses", courses);
app.use("/", home);

app.use(auth);

//Configuration *NEVER STOP PASSWORDS IN CONFIG FILES*
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // logging HTTP request
  console.log("Morgan enabled...");
}

// The app object has many useful methods
// app.get()
// app.post()
// app.put()
// app.delete()

//how to set a port with a envornment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
