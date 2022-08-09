const moment = require('moment');
const express = require("express");
const examServices = require("../services/examServices");
const examRouter = express.Router({strict: true, mergeParams: true});


//fucntion to valid if the id exists
const validateId =  async (req, res, next) =>{
 
   const { studentId } = req.params;
   
   
     if (await examServices.studentExists(studentId)) next();
      else  res.status(404).render('Error', {message : "Erorr : Could not find this student ID <br/> Please check the url ID" });
   
   

}


//handling the error and formating it 
const handleErrors = (err,formatedErr) => {
    //duplicate errors
  formatedErr.status = err.message
  // validation errors
 if (err.name == 'ValidationError') {
  formatedErr.status = err._message
  
   Object.values(err.errors).forEach(({properties}) => {
        //adding errors to rquest body to send it back 
        formatedErr[properties.path+`Error`] = properties.message;
   });
 }
  return formatedErr;
}



//show all exams of student
examRouter.route("/:studentId").all(validateId).get(async (request, response) => {
    const {studentId} = request.params;
    const exams = await examServices.getStudentAllExams(studentId);
    response.status(200).render("showExams",{exams ,moment,url : request.originalUrl})
   
  });
  
 
//redirect to page for adding exam
examRouter.route("/:studentId/add").all(validateId).get(async (request,response) =>{
  response.status(301).render("addOrUpdateExam",{title : "Add Exam", moment,exam : {}, url : request.originalUrl});
})
//ADD NEW EXAM
examRouter.post("/:studentId/add",async (request, response) => {//post
  try {
     const studentId = request.params.studentId;
     await examServices.addStudentExam(studentId,request.body)
    
    
     response.status(201).redirect(`../${studentId}`)
  } catch (err) {
    const updatedError = handleErrors(err,request.body)
    response.status(400).render("addOrUpdateExam",{title : "Add Exam", moment,exam : updatedError, url : request.originalUrl});

  }
})







//edit exam validate id middleware
examRouter.route("/:studentId/edit").all(validateId)
 

//THIS IS INORDER TO GET TO THE EDIT PAGE
examRouter.route("/:studentId/edit").post(async (request, response) => {
  const studentId = request.params.studentId;
  const examId = request.body._id
   try {
    const studentExam = await examServices.getStudentExam(studentId,examId)
   
    response.status(301).render("addOrUpdateExam",{title : "Update Exam",moment,exam : studentExam, url : request.originalUrl});
  } catch  {
    return response.status(404).render('Error', {message : `Exam Not Found  <br/> ${examId} is invalid id` });
  }
 
  
  });

//UPDATE EXAM
examRouter.put("/:studentId/edit",async (request, response) => {
  try {
    
    
    const studentId = request.params.studentId;
   await examServices.updateStudentExam(studentId,request.body)
     
     return response.status(201).redirect(`../${studentId}`)
     
  } catch (err) {
    const updatedError = handleErrors(err,request.body)
    response.status(400).render("addOrUpdateExam",{title : "Update Exam", moment,exam : updatedError, url : request.originalUrl});

}})








//DELETE EXAM
examRouter.delete("/:studentId",async (request, response) => {//post
  try {
    
    
    const studentId = request.params.studentId;
    const examId = request.body._id
     await examServices.deleteStudentExam(studentId,examId)
     return response.status(204).redirect(`back`)
    
  } catch  {
    return response.status(404).send(`Exam Not Found - ${examId} is invalid id`);
  
  }
})


  module.exports = examRouter;