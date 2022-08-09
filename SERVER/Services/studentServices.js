const Student = require("../Models/studentsModel");

const getAllStudents = async () => {
	const students = await Student.find({}).lean();
	return students;
};

const getStudentById = async (id) => {
	const student = await Student.findById(id).lean();
	return student;
};

const addStudent = async (newStudent) => {
	const student = new Student(newStudent);
	await student.save();
	return student;
};

const updateStudent = async (id, studentToUpdate) => {
	const students = await Student.findByIdAndUpdate(id, studentToUpdate,{/*runValidators: true ,*/new: true});
	return students;
	
};
const deleteStudent = async (id) => {
	const students = await Student.findByIdAndRemove(id);
	return students
};

const studentExists = async (id) => {
	try{
		return await Student.exists({_id : id})
	} catch {
		return false
	}
 	
};

module.exports = {
	studentExists,
	deleteStudent,
	getAllStudents,
	addStudent,
	updateStudent,
	getStudentById,
};
