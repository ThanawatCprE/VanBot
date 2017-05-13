
var data;
// var x;
var data1 = {
  userImg :"https://www.atomix.com.au/media/2015/06/atomix_user31.png",
  urlimg : "http://kora11.com/wp-content/uploads/2014/03/dsaf.gif",
  company : "ชนิกาทัวร์",
  route : "กรุงเทพไปสระบุรี",
  cost : "100",
  time : "8.00",
  distance : "100",
  phone : "09812345678"
}
var data2 = {
  userImg :"https://www.atomix.com.au/media/2015/06/atomix_user31.png",
  urlimg : "https://archive.org/services/img/image",
  company : "",
  route : "",
  cost : "",
  time : "",
  distance : "",
  phone : ""
}
function yud(x){
  console.log(x);
}
module.exports = function(app,express,session,auth){
  var router = express.Router();
  router.get('/',function(req,res){
    data = data1;
    res.render('page/profile',{user:req.session.email,data});
  })
  router.get('/edit',function(req,res){
    data = data1;
    res.render('page/details',{user:req.session.email,data});
  })
  router.get('/add',function(req,res){
    data = data2 ;
    res.render('page/details',{user:req.session.email,data});
  })
  app.use('/profile',auth,router)
}
