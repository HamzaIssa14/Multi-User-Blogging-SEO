const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRoute = require("./routes/blogRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const tagRoute = require("./routes/tagRoute");
require("dotenv").config();

// app
const app = express();

// connect to DB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  });

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
if (process.env.NODE_ENV === "development") {
  // while we are in development mode..

  app.use(cors()); // allows your front end and backend to run on different ports (i.e. frontEnd on port 3000 and backEnd on port 8000)
}

// route middleware
app.use("/api", blogRoute);
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", tagRoute);

// Listen to the back-end port that will recieve requests for the backend
// So our backend runs on port 8000 and our frontend runs on port 3000, two seperate origins
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
