
// var data;
// var x;
var shemaUser ={
  userImg :"",
  company : ""
}
var shemaDetail = {
  urlimg : "",
  route : "",
  cost : "",
  time : "",
  distance : "",
  phone : "",
  gps : ""
}
module.exports = function(app,express,session,auth,client){
  var router = express.Router();
  router.get('/',function(req,res){
    client.query("select * from vanuser where id ='"+req.session.email+"';",function(err,user){
      shemaUser.userImg = user.rows[0].urlimg ;
    })
      client.query("select * from company where owner ='"+req.session.email+"';",function(err,company){
        if(err) throw err;
        client.query("select * from cdetail where cname ='"+company.rows[0].name+"';",function(errs,cdetail){
          if(errs) throw errs;
          shemaDetail.route = cdetail.rows[0].rcompany;
          shemaDetail.cost = cdetail.rows[0].cost;
          shemaDetail.urlimg = cdetail.rows[0].cimage;
          shemaDetail.gps = cdetail.rows[0].clocation;
          client.query("select * from route where routing ='"+cdetail.rows[0].rcompany+"';",function(errss,route){
            if(errss) throw errss;
            shemaDetail.distance = route.rows[0].distance;

          });
          client.query("select * from round_company where cname ='"+cdetail.rows[0].cname+"' and rcompany ='"+cdetail.rows[0].rcompany+"';",function(errss,round){
            if(errss) throw errss;
            shemaDetail.time = round.rows[0].time;
            res.render('page/profile',{shemaUser,shemaDetail});
          });
        });
        shemaDetail.phone = company.rows[0].phone;
        shemaUser.company = company.rows[0].name;
      });
  })
  router.get('/edit',function(req,res){
    res.render('page/details',{shemaUser,shemaDetail});
  })
  router.get('/add',function(req,res){
    shemaDetail = {};
    res.render('page/details',{shemaUser,shemaDetail});
  })
  app.use('/profile',auth,router)
}
