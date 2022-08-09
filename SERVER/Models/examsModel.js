const moment = require("moment");
const mongoose = require("mongoose")
const {isAlphanumeric} = require("validator")
const Schema = mongoose.Schema;



//console.log(array1.find(({name,total}) => (name == "B" || total==400)));




const examSchema = new Schema({

    
       
    name : {
        type: String,
        trim : true,
        set : value => value.replace(/\s+/g, ' '),
        required: true,
        validate : {
            
            validator : value => isAlphanumeric(value,[`en-US`],{ignore: ' '}),
            message : error => `Name should contain only letters and numbers (Please remove ${error.value.replace(/[a-z0-9\s]/gi, '')})`
        },
       // cast:  [false, "SAD"],
        minlength : [3, "{VALUE} is not at least 3 characters"],
       
      },
      date :  {
        type : Date,
        //set :  date => moment(date).format('YYYY-MM-DD'),
       // min : moment().subtract(120,"years").format( 'YYYY-MM-DD'),
       // max : [moment().subtract(18,"years").format( 'YYYY-MM-DD') , "must be 18"]
        
    } ,
     grade: {
            type: Number,
            min: [0, "{VALUE} Can not be negative"],
            max:[100, "{VALUE} Can not be greater than 100"],
        }
    ,
    
      
    
},{ versionKey: false ,/* _id: false*/ })
// studentSchema.pre("validate", function(next)  {
//   this.fullname = this.fullname.replace(/\s+/g, ' ')
//   console.log("inprevalid");
// //  this.updatedAt = Date.now();
// next(); 
// })

// examSchema.post("validate", async function(next) {
//     const result = await Student.find( {'exams.grade': {$gte: 18}},)
//    console.log("pre",result);
//    next();
//  });

//const model =  mongoose.model("Student",studentSchema)
//model.count({}, function( err, count){
  //console.log( "Number of users:", count );
//})

// studentSchema.post("validate",function (next){
//   console.log("presave");
// studentSchema.plugin(AutoIncrement,{disable_hooks:false})

// next();
// })

module.exports = examSchema