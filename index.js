const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('./config/config')

mongodb.mongodb
const express = require('express')
const nocache = require('nocache')
const multer = require('multer');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000 ;
console.log(process.env.PORT,"Lllllllllllll");
const session = require('express-session')


var app = express()
app.use(nocache())
app.use(express.static('public/user-assets'))  
// app.use(express.static('public')) 
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  })); 

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));







const userRouter = require('./router/user_router')
app.use('/',userRouter)

const adminRouter = require('./router/admin_router')
app.use('/admin',adminRouter)


app.listen(port,()=> {
    console.log("server is running on http://localhost:3000");
})
