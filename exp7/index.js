// This is the main file of the project
// This file is responsible for starting the server and connecting to the database
import express from "express";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/bookRoute.js";

const app = express();
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
.connect(MONGO_URI)
.then(() => {
console.log("Database Connected Successfully!!")
app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});
})
.catch((error) => console.log(error));

console.log("Hello, world!");
app.use("/api/book", route);

app.get("/", (req, res) => {
res.send("Welcome to the book Management API!");
});