require("dotenv").config();
const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/app");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use(router);

dbConnect();

// app.get("/", (req,res) => res.json({msg:"hello world!!!"}));

app.use(errorHandler);

app.listen(PORT, console.log(`Banckend is running on port: ${PORT}`));