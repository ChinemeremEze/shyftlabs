const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: "../.env.local" });
const { v4: uuidv4 } = require('uuid');
const { MONGO_URI } = process.env;
const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
};
const client = new MongoClient(MONGO_URI, options);

/**
 * This is a function to create a student
 * It checks the request object for fields required to create a student
 * It also checks if a student with the presented email exsists 
 * If all checks are passed a new student is created and a success response is sent back.
 * @param {*} req 
 * @param {*} res 
 * @returns a response status
 */

const createNewStudent = async (req, res) =>{
    try{
        if(!req.body.email){
            return res.status(400).json({status: 400, message: "Email is required"});
        }
        if(!req.body.firstName || !req.body.lastName || !req.body.dob ){
            return res.status(400).json({status: 400, message: "Some info is missing please try again"});
        }
        //create a client and connect to the database
        await client.connect();
        const db = client.db("Test");
        //add the new student if a student with that email does not exists, sends error message if the user does
        const studentExists =  await db.collection("students").findOne({email: req.body.email});
        if(studentExists){
            return res.status(400).json({status: 400, message: "Email taken"});
        }
        const student = {
            "id": uuidv4(),
            "first_name": req.body.firstName,
            "last_name": req.body.lastName,
            "dob": req.body.dob,
            "email": req.body.email,
            "date_created": new Date(),
        }
        await db.collection("students").insertOne(student);
        client.close();
        res.status(200).json({status: 200, message:"Student created", data: student});
    }catch (err){
        console.log(err)
        res.status(400).json({status:400, message:"Caught an error"});
    }
    
}

/**
 * This is a function to create a student
 * It checks the request object for fields required to create a student
 * It also checks if a student with the presented email exsists 
 * If all checks are passed a new student is created and a success response is sent back.
 * @param {*} req 
 * @param {*} res 
 * @returns a response status
 */
const createNewCourse = async (req, res) =>{
    try{
        if(!req.body.courseName){
            return res.status(400).json({status: 400, message: "Course Name is required"});
        }
        //create a client and connect to the database
        await client.connect();
        const db = client.db("Test");
        //add the new student if a student with that email does not exists, sends error message if the user does
        const courseExists =  await db.collection("courses").findOne({course_name: req.body.courseName});
        if(courseExists){
            return res.status(400).json({status: 400, message: `Course ${req.body.courseName} has been taken`});
        }
        const course = {
            "id": uuidv4(),
            "course_name": req.body.courseName,
            "date_created": new Date(),
        }
        await db.collection("courses").insertOne(course);
        client.close();
        res.status(200).json({status: 200, message:"New Course created", data: course});
    }catch (err){
        console.log(err)
        res.status(400).json({status:400, message:"Caught an error"});
    }
    
}

/**
 * This is a function to create a student
 * It checks the request object for fields required to create a student
 * It also checks if a student with the presented email exsists 
 * If all checks are passed a new student is created and a success response is sent back.
 * @param {*} req 
 * @param {*} res 
 * @returns a response status
 */
const createNewResult = async (req, res) =>{
    try{
        if(!req.body.courseName){
            return res.status(400).json({status: 400, message: "Course Name is required"});
        }
        if(!req.body.firstName || !req.body.lastName){
            return res.status(400).json({status: 400, message: "Student Name is required"});
        }
        if(!req.body.resultScore || req.body.resultScore < 0 || req.body.resultScore > 100){
            return res.status(400).json({status: 400, message: "Result Score is required (0 -100)"});
        }
        //create a client and connect to the database
        await client.connect();
        const db = client.db("Test");

        //check if the course exist
        const courseExists =  await db.collection("courses").findOne({course_name: req.body.courseName});
        if(!courseExists){
            return res.status(400).json({status: 400, message: `${req.body.courseName} does not exsist`});
        }
       //check if the student exist
        const studentExists =  await db.collection("students").findOne({first_name: req.body.firstName, last_name: req.body.lastName});
       if(!studentExists){
           return res.status(400).json({status: 400, message: `${req.body.firstName} ${req.body.lastName} does not exsist`});
       }

        //add the new result if a student and courses exists,
        const resultExists =  await db.collection("results").findOne({course_name: req.body.courseName, student_name: req.body.firstName + " " + req.body.lastName});
        if(resultExists){
            return res.status(400).json({status: 400, message: `${req.body.firstName + " " + req.body.lastName} already has score for ${req.body.courseName}`});
        }
        const result = {
            "id": uuidv4(),
            "course_name": req.body.courseName,
            "student_name": req.body.firstName + " " + req.body.lastName,
            "score": req.body.resultScore,
            "date_created": new Date(),
        }
        await db.collection("results").insertOne(result);
        client.close();
        res.status(200).json({status: 200, message:"New Result uploaded", data: result});
    }catch (err){
        console.log(err)
        res.status(400).json({status:400, message:"Caught an error"});
    }
    
}
/*
This async function handles getting all students in the db
If the student array has a length of zero there are no students in the database
*/
const getStudents = async (req, res) => {
    try{
    // creates a new client
    await client.connect();
    const db = client.db("Test");
  
    const students = await db.collection("students").find().toArray();
    console.log(students);
  
    if (students.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "No students are in this collection" });
    }
     res.status(200).json({ status: "200", message: "Success", data: students });
  
    // close the connection to the database server
    client.close();
  
    console.log("disconnected!");
    }catch(err){
        console.log(err);
        res.status(400).json({status:400, message:"Caught an error"});
    }
};

const getResults = async (req, res) => {
    try{
    // creates a new client
    await client.connect();
    const db = client.db("Test");
  
    const results = await db.collection("results").find().toArray();
    console.log(results.length)
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "No results are in this collection" });
    }
     res.status(200).json({ status: "200", message: "Success", data: results });
  
    // close the connection to the database server
    client.close();
  
    console.log("disconnected!");
    }catch(err){
        console.log(err);
        res.status(400).json({status:400, message:"Caught an error"});
    }
};

const getCourses = async (req, res) => {
    try{
    // creates a new client connection
    await client.connect();
    const db = client.db("Test");
  
    const courses = await db.collection("courses").find().toArray();
  
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "No courses are in this collection" });
    }
     res.status(200).json({ status: "200", message: "Success", data: courses });
  
    // close the connection to the database server
    client.close();
  
    console.log("disconnected!");
    }catch(err){
        console.log(err);
        res.status(400).json({status:400, message:"Caught an error"});
    }
};
module.exports = { createNewStudent, createNewCourse, createNewResult, getStudents, getCourses, getResults}



