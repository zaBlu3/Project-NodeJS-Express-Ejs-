const express = require("express");
const app = express();
const studentsRouter = require("./Routes/studentRoute");
const examRouter = require("./Routes/examsRouter");
const methodOverride = require("method-override")
const connectDB = require("./configs/db");
const PORT = process.env.PORT || 4000;
const cors = require('cors')



 
app.set('strict routing', true)
app.use(cors())
app.use(methodOverride("_method"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('../CLIENT/public'));
app.set('views',"../CLIENT/Views")
app.use("/students", studentsRouter); // "http:localhost:3000/students"
app.use("/exams", examRouter)



connectDB();

app.listen(
    PORT,
    () => console.log(`app listening on port ${PORT}`)
    )
