const {Router} = require("express");
const studentServices = require("../services/studentServices");
const moment = require('moment');
const studentRouter = Router({strict: true});



const validateId =  async (req, res, next) =>{
   const { id } = req.params;
          if (await studentServices.studentExists(id)) next();
        else  res.status(404).render('Error', {message : "Erorr : Could not find this student ID <br/> Please check the url ID" });
       
  
   }
   


const handleErrors = (err,formatedErr) => {
      
      // duplicate email error
    if (err.message.includes("E11000")) {
      formatedErr.status = "duplicate error"
      formatedErr.emailError = 'that email is already registered';
      return formatedErr;
    }
      // validation errors
    if (err.name == 'ValidationError') {
      formatedErr.status = "Validation Error"
           Object.values(err.errors).forEach(({ properties }) => {
             formatedErr[properties.path+`Error`] = properties.message;
      });
    }
    
    return formatedErr;
  }
  

// GET ALL
studentRouter.route("/").get(async (request, response) => {
  try {
    const students = await studentServices.getAllStudents();
    response.status(200).render('allStudents', { students , url : request.originalUrl });
  } catch (err) {
       return response.status(500).json(err.message);
  }
});

// redirect to add form
studentRouter.route("/add").get(async (request, response) => {
     response.status(202).render("addOrUpdateStudent",{title :"Add Student",student: request.body,moment})
  })
// ADD  
studentRouter.route("/add").post(async (request, response) => {
    try {
        await studentServices.addStudent(request.body);
        response.status(201).redirect('/students')
    } catch (err) {
       const updatedError = handleErrors(err,request.body)
      response.status(400).render("addOrUpdateStudent",{title :"Add Student",student: updatedError ,moment})
      }
  });

// GET ONE By Id
studentRouter.route("/:id").all(validateId).get(async (request, response) => {
  try {
    const id = request.params.id;
    const student = await studentServices.getStudentById(id);
     response.status(200).render(`showStudent`,{student,moment});
  } catch (err) {
     return response.status(500).json(err.message);
  }
});

 
//redirect to edit form with data
studentRouter.route("/:id/edit").get(validateId,async (request, response) => {
  const id = request.params.id;
  const student = await studentServices.getStudentById(id);
  response.status(301).render("addOrUpdateStudent",{student ,moment,title : "Update Student", url : request.originalUrl})
})
  
// PUT
studentRouter.route("/:id").put(async (request, response) => {
    try {
      console.log("input",request.body);
      const id = request.params.id;
      const student = request.body;
      const result = await studentServices.updateStudent(id, student);
       response.status(201).render("addOrUpdateStudent",{title :"Update Student",student: result ,url : request.originalUrl+"/edit",moment})

    } catch (err) {
      const updatedError = handleErrors(err,request.body)
      response.status(400).render("addOrUpdateStudent",{title :"Update Student",student: updatedError ,url : request.originalUrl+"/edit",moment})
    }
  });



// DELETE
studentRouter.route("/:id").delete(async (request, response) => {
  try {
      const id = request.params.id;
    await studentServices.deleteStudent(id);
    return response.status(200).redirect(`/students`);
  } catch (err) {
    return response.status(500).json({ message: err.message })
  }
});

module.exports = studentRouter;
