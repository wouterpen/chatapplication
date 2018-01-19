var express = require("express");
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var port = process.env.port
var cookieParser = require('cookie-parser')
const pg = require ('pg')
const bodyParser = require ("body-parser")  
const Client = pg.Client  
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
require ('dotenv').load();
var bcrypt = require('bcrypt');
app.use(express.static('public'));
var	session = require('express-session')
users = {};
connections=[];
app.use(cookieParser());

const client = new Client ({  
	user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    portdatabase: process.env.portdatabase
})

client.connect()

app.use(session({
	secret: '2C44-4D44-WppQ385',
	saveUninitialized: true,
	resave: true // even if nothing is changed go ahead and save it again
}));

require("./routes/index.js")(app)
require("./routes/randomchat.js")(app,client)
require("./routes/socket.js")(app, io, client)
require("./routes/login.js")(app, client)
require("./routes/signup.js")(app, client)
require("./routes/logout.js")(app, client)

server.listen(port|| 3000, ()=>{
	console.log("server running")
});