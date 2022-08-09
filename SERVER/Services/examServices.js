const Student = require("../Models/studentsModel");


const getStudentAllExams = async (id) => {
 
	const {exams} = await Student.findById(id).select({ "exams": 1/*, "_id": 0*/}).lean()
	return exams;
};
const getStudentExam = async (StudnetId,ExamId) => {
	//const {exams :[exam]} = await Student.findOne({_id : StudnetId, "exams._id" : ExamId},{"exams.$":1, _id : 0})
	const {exams :[exam]} = await Student.findById(StudnetId).where("exams._id").equals(ExamId).select("exams.$ -_id") // maybe custom
	return exam;
};

const addStudentExam = async (id,examToAdd) => {
	if (await Student.containExam(id,examToAdd)){
		throw new Error("already has exam with the same name and date")}
	const student = await Student.findById(id)
	student.exams.push(examToAdd) 
	await student.save()
    return student.exams
	
};
const deleteStudentExam = async (studentId,examId) => {
    const student = await  Student.findById(studentId)
	 await student.exams.id(examId).remove()
	 await student.save()
     return "exam removed"

}
const updateStudentExam = async (id,examToUpdate) => {
	if (await Student.containExam(id,examToUpdate)){
		throw new Error("already has exam with the same name and date")} // look AT IT 
	  await Student.findOneAndUpdate(
		{_id: id, 'exams._id': examToUpdate._id}, 
 		{$set: {'exams.$': examToUpdate}},
 		{returnOriginal : false}
 	  );
	 
// const log = await Student.findByIdAndUpdate(id,"fullname")
	// 	{'exams._id': examToUpdate._id}, 
	// 	{$set: {'exams.$.name': "examToUpdate"}}//,{returnOriginal : false}
	//   );	
 // oldExams.push(examToAdd)
 
  //const {exams} = await Student.findByIdAndUpdate(id,{exams : oldExams},{new:true})
	//return exams;
};
//   addStudent({
//       fullname: "SAD sos",
//       email : "12345678@sad.com",
//       faculty: "PC"
//   }).then(X=>console.log(X)).catch(err=>console.log(err))

const studentExists = async (id) => {
	try{
		return await Student.exists({_id : id})
	} catch {
		return false
	}
 	
};
module.exports = {
	studentExists,
    addStudentExam,
    updateStudentExam,
	getStudentAllExams,
	getStudentExam,
      deleteStudentExam,
}