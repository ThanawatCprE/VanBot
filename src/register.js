
module.exports =function(app,express,client){
  var router = express.Router()
  router.get('/',function(req,res){
    res.render('page/register');
  })
  router.get('/save',function(req,res){
    console.log(req.query);
    client.query("insert into vanuser values('"+req.query.email+"','"+req.query.password+"','"+req.query.image+"');",function(err,rows,fields){
      if(err) throw err;
      console.log("register ........");
    });
    client.query("insert into company values('"+req.query.CN+"','"+req.query.phone+"','"+req.query.email+"');",function(err,rows,fields){
      if(err) throw err;
      console.log("Add company ........");
    });
    res.redirect('/');
    // data = data1;
    // res.render('page/details',{user:req.session.email,data});
  })
  app.use('/register',router);
};
