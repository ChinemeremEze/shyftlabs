"use strict";

const express = require("express");
//const morgan = require("morgan");
const {
    createNewStudent, 
    createNewCourse,
    createNewResult,
    getStudents,
    getCourses,
    getResults,
  } = require("./handlers");




const app = express();
// Below are methods that are included in express(). We chain them for convenience.
// --------------------------------------------------------------------------------
// This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
//app.use(morgan("tiny"));
app.use(express.json());

app.get('/', (req, res) =>{
    res.status(200).json({
        status: 200,
        message: "Welcome to Shyftlabs Backend"
    });
});
//Rest apis to create and get students, courses and results
app.post('/create-student', createNewStudent);
app.post('/create-course', createNewCourse);
app.post("/create-result", createNewResult);
app.get("/students", getStudents);
app.get('/courses', getCourses);
app.get("/results", getResults);



app.get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
});
  
  // Node spins up our server and sets it to listen on port 8000.
  app.listen(8000, () => console.log(`Listening on port 8000`));
  