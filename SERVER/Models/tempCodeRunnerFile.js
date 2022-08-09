studentSchema.statics.containExam = async function (id,{name,date,_id}){ // check if contains exam with the same name and date

  
  //const length = await this.findOne({_id : id, "exams.$_id" : {$ne : _id} ,exams : {$elemMatch:{name, date}}},{"exams.$":1, _id : 0})
  //const length = await this.find({_id : id, "exams._id" : {$ne : _id} ,exams : {$elemMatch:{name, date , _id: {$ne : _id}}}},{"exams.$":1, _id : 0})
   
 // await this.findById(id).where("exams").elemMatch({name,date}).where("exams._id").ne(_id)//.select("exams.$")
  

  return this.findById(id).where("exams").elemMatch({name,date,_id: {$ne : _id}})
 
}