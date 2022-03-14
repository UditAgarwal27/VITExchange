const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db').connect();

const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());

//ROUTES

//FOR GENERATING A NEW ACCESS TOKEN FROM REFRESH TOKEN
const tokenRoute = require('./Controller/utils/generateNewAccessToken');
app.use("/generateNewToken", tokenRoute)

//USER ROUTES
const userRoute = require('./Controller/user');
app.use("/user", userRoute);

module.exports = app;
