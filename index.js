import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import baseRoutes from "./routes/baseRoutes.js";
import connectDb from "./config/connectDb.js";
console.log('Loaded environment variables:', process.env);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.CONNECTION_URL);
console.log('MongoDB URI:', process.env.JWT_SECRET);
connectDb()
const app = express();
app
  .use(bodyParser.json({ limit: "30mb", extended: true }))
  .use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
  .use(cors())
  .use("/api/v1", baseRoutes);


const PORT = process.env.PORT || 3300 ;

app.listen(
  PORT,
  console.log(`Server is running on ${PORT} in ${process.env.NODE_ENV} mode...`)
);
