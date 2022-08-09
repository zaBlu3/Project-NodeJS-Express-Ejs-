const mongoose = require("mongoose");

const connectDB = () => {
	const uri = "mongodb://localhost:27017/StudentsDB";
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4,
	};
	 mongoose.connect(uri, options)
		.then(() => console.log("connected to Students DB"))
		.catch((err) => console.log(err));
};
module.exports = connectDB;
