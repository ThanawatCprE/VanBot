const express =require('express');
const bodyPaser = require('body-parser');
const route = require('./src/route');
const bot = require('./src/bot');
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

app.get('/', function (req, res) {
     res.render('index');
});
app.get('/register', function (req, res) {
     res.render('page/register');
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
   console.log(req.query.email);
   user=req.query.email
   if (!req.query.email || !req.query.password) {
     res.send('login failed');
   } else if(req.query.email === "amy@gmail.com" || req.query.password === "1234") {
     req.session.email = req.query.email;
     req.session.admin = true;
     res.redirect('/profile');
   }
 });
//
 app.use('/profile', auth, route);

 app.get('/logout', function (req, res) {
   req.session.destroy();
   res.redirect('/');
 });
var test ={
	get_started:{
    "payload":"GET_STARTED_PAYLOAD"
  }
}
bot(app,pg,token,access,bodyPaser,request);
 // function callThreadSettingsAPI(data) { //Thread Reference API
 // request({
 // uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
 // qs: { access_token: access },
 // method: 'POST',
 // json: data
 //
 // }, function (error, response, body) {
 // if (!error && response.statusCode == 400) {
 //   console.log("Thread Settings successfully changed!");
 // } else {
 //   console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
 // }
 // });
 // }
 //
 // function createGetStarted() {
 // var data = {
 //   "setting_type":"greeting",
 //     "greeting":{
 //       "text":"สวัสดี {{user_full_name}} \r\nกดที่ปุ่ม 'เริ่มต้นใช้งาน' เพื่อเปิดใช้งาน VanBOT 🚎"
 //     }
 // };
 // callThreadSettingsAPI(data);
 // }
app.listen(app.get('port'),function(){
  // createGetStarted();
	console.log('runing on port',app.get('port'))
})
