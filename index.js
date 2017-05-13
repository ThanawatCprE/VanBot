const express =require('express');
const bodyPaser = require('body-parser');
const profile = require('./src/profile');
const request = require('request');
const session = require('express-session');
const app =express();
const pg = require("pg");

const token = process.env.FB_VARIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

app.set('port',(process.env.PORT || 5000))

app.use(bodyPaser.urlencoded({extended:false}));
app.use(bodyPaser.json());

app.set('view engine', 'ejs');

app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js/select',express.static(__dirname + '/node_modules/bootstrap-select/dist/js'));
app.use('/css/select',express.static(__dirname + '/node_modules/bootstrap-select/dist/css'));
app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/node_modules/jquery/dist'));

var client = new pg.Client({
  user: "ifeygszgzemhgc",
  password: "c6500d57a0d859b425fbf6808052bcf2d0955da468aa90ff069c6c9c85cc536f",
  database: "djmi984ka9f4r",
  port: 5432,
  host: "ec2-23-23-111-171.compute-1.amazonaws.com",
  ssl: true
});
client.connect();

app.get('/', function (req, res) {
     res.render('index');
});
//
 app.use(session({
     secret: '2C44-4D44-WppQ38S',
     resave: true,
     saveUninitialized: true
 }));

 var auth = function(req, res, next) {
   if (req.session && req.session.email === user && req.session.admin)
     return next();
   else
     return res.sendStatus(401);
 };
//
//
var user='';
 app.get('/login', function (req, res) {
   client.query("select * from vanuser where id ='"+req.query.email+"' and pass = '"+req.query.password+"';",function(err,rows,fields){
     if (err || rows.rows == ""){
       res.send('login failed');
     }
     else{
       user=req.query.email;
       req.session.email = req.query.email;
       req.session.admin = true;
       res.redirect('/profile');
     }
   })
  //  console.log(req.query.email);
  //  user=req.query.email
  //  if (!req.query.email || !req.query.password) {
  //    res.send('login failed');
  //  } else if(req.query.email === "amy@gmail.com" || req.query.password === "1234") {
  //    req.session.email = req.query.email;
  //    req.session.admin = true;
  //    res.redirect('/profile');
  //  }
 });
//
require('./src/register')(app,express,client);
require('./src/profile')(app,express,session,auth,client);
// app.use('/profile', auth,profile);

 app.get('/logout', function (req, res) {
   req.session.destroy();
   res.redirect('/');
 });

require('./src/bot')(app,client,token,access,bodyPaser,request);

app.listen(app.get('port'),function(){
	console.log('runing on port',app.get('port'))
})
