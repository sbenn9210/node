const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

// The app object has many useful methods
// app.get()
// app.post()
// app.put()
// app.delete()

const courses = [
  { id: 1, name: "React" },
  { id: 2, name: "Angular" },
  { id: 3, name: "Vue" }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//use query parameters to get optional information
app.get("/api/posts/courses/:id", (req, res) => {
  res.send(req.query);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

// You should always validate the request from the user ALWAYS!!!!
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // without joi
  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad request
  //   res
  //     .status(400)
  //     .send("Name is required and should be a minimum of 3 characters");
  //   return;

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

//updating a course
app.put("api/courses/:id", (req, res) => {
  //Look up the course
  //If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //Validate
  //If invalid, return 400 - Bad request
  // const result = validateCourse(req.body);
  //descructuring the error object
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
    return;
  }
  //Update course
  course.name = req.body.name;
  //Return the updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const result = Joi.validate(course, schema);
}

app.delete("api/courses/:id", (req, res) => {
  //Look up the course
  //Not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Return the same course
  res.send(course);
});

//how to set a port with a envornment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
