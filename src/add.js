module.exports = function(app,express,session,auth,client,shemaUser){

  var router = express.Router();
  router.get('/',function(req,res){
    var shemadata = {
      urlimg:"data:image/png;base64,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"
    };
    res.render('page/details',{shemaUser,shemadata});
  })
  router.get("/save",function(req,res){
    console.log(req.query);

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
        },10);
        // var start = req.query.start
        // var end = req.query.end
        // while(1){
        //   if(){
        //
        //   }
        // }
        console.log();
     })


  })
  app.use('/profile/add',auth,router)
}
