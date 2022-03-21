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
const token_route = require('./Controller/utils/generate_new_access_token');
app.use("/api/generate-new-token", token_route)

//USER ROUTES
const user_route = require('./Controller/user');
app.use("/api/user", user_route);

module.exports = app;
