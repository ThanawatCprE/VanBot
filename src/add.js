

module.exports = function(app,express,session,auth,client,shemaUser,gettime){

  var router = express.Router();
  router.get('/',function(req,res){
    var shemadata = {
      urlimg:"http://www.technodoze.com/wp-content/uploads/2016/03/default-placeholder.png"
      ,time:["2.00","2.00","Select round"]
    };
    res.render('page/details',{shemaUser,shemadata});
  })
  router.get("/save",function(req,res){
    var time = gettime(req.query.start,req.query.end,req.query.round,req.query.user,req.query.route);
    console.log(time);
     client.query("select * from route where routing='"+req.query.route+"';",function(err,route){
        if(route.rows == ""){
           client.query("insert into route values('"+req.query.route+"',"+req.query.distance+");",function(errs,user){
              if(errs) throw errs;
              console.log("Add route.....................")
           })
        }
        setTimeout(function(){
          client.query("insert into cdetail values('"+req.query.user+"','"+req.query.route+"',"+req.query.cost+",'"+req.query.image+"','"+req.query.GPS+"');",function(errs,user){
               if(errs) throw errs;
               console.log("Add cdetail .....................")
          })
          client.query("insert into round_company values"+time+";",function(errs,user){
                if(errs) throw errs;
                console.log("Add round_company .....................")
          })
        },10);
     })
     console.log(time);
     res.redirect('/profile');
  })
  app.use('/profile/add',auth,router)
}
