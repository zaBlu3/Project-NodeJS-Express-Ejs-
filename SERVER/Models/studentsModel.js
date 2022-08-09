const moment = require("moment");
const mongoose = require("mongoose")
const {isEmail ,isAlphanumeric, isAlpha} = require("validator")
const Schema = mongoose.Schema;
const examSchema = require("../Models/examsModel");



const studentSchema = new Schema({

    
       
    fullname : {
        type: String,
        trim : true,
        set : removeExtraSpace,
        required: true,
        validate : {
            
            validator : value => isAlpha(value,[`en-US`],{ignore: ' '}),
            message : error => `Name should contain only letters (Please remove ${error.value.replace(/[a-z\s]/gi, '')})`
        },
       // cast:  [false, "SAD"],
        minlength : [5, "{VALUE} is not at least 5 characters"],
       
      },
    email : {
        type: String,
        trim : true,
        required: true,
        unique : true,
        lowercase:true,
        validate : [isEmail,"{VALUE} is not a valid email"],
        minlength : 10,
      },
      faculty : {
        trim : true,
        set : removeExtraSpace,
        type: String,
        required: true,
        validate : {
            
            validator : value => isAlphanumeric(value,[`en-US`],{ignore: ' '}),
            message : error => `faculty should contain only letters and numbers  (Please remove ${error.value.replace(/[a-z0-9\s]/gi, ''  )})`
        },
      },
    birthDate :  {
        type : Date,
        
        min : [moment().subtract(120,"years").format( 'YYYY-MM-DD'), "cant be more than 120"],
        max : [moment().subtract(18,"years").format( 'YYYY-MM-DD') , "must be 18"]
        
    } ,
    exams : [examSchema]
        
      
    
},{ versionKey: false ,timestamps: true/* _id: false*/ })

// studentSchema.pre("validate", function(next)  {
//   this.fullname = this.fullname.replace(/\s+/g, ' ')
//   console.log("inprevalid");
// //  this.updatedAt = Date.now();
// next(); 
// })
function removeExtraSpace(string){
  return string.replace(/\s+/g, ' ')
}
studentSchema.statics.containExam = async function (id,{name,date,_id}){ // check if contains exam with the same name and date

  
  //const length = await this.findOne({_id : id, "exams.$_id" : {$ne : _id} ,exams : {$elemMatch:{name, date}}},{"exams.$":1, _id : 0})
  //const length = await this.find({_id : id, "exams._id" : {$ne : _id} ,exams : {$elemMatch:{name, date , _id: {$ne : _id}}}},{"exams.$":1, _id : 0})
   
 // await this.findById(id).where("exams").elemMatch({name,date}).where("exams._id").ne(_id)//.select("exams.$")
  

  return this.findById(id).where("exams").elemMatch({name,date,_id: {$ne : _id}})
 
}

studentSchema.pre('findOneAndUpdate', function(next) {//validate pre updates
  this.options.runValidators = true;
  next();
});

var Student = mongoose.model('Student' , studentSchema);

module.exports = Student;

