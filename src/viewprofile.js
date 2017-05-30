
// var data;
// var x;
var shemaUser ={
  userImg :"",
  company : ""
}
var shemaDetails={}
function genshema(i){
  var shemaDetail = `{
    "urlimg" : "`+cdetail[i].urlimg+`",
    "id" : "`+cdetail[i].id+`",
    "owner"  : "`+company[i].owner+`",
    "phone" : "`+company[i].phone+`",
    "name" : "`+company[i].name+`"
  }`
  //console.log(shemaDetail);
  var shema = JSON.parse(shemaDetail);
  pushdata(shema);
}
function pushdata(data){
  total.push(data);
 // console.log(total);
}


var total = [];
var cdetail
var company
var time;
var distance;
var phone;
module.exports = function(app,express,session,auth,client){

  var router = express.Router();
  router.get('/',function(req,res){
    total = [];
    client.query("select * from vanuser where id ='"+req.session.email+"';",function(err,user){
      shemaUser.userImg = user.rows[0].urlimg ;

    })

      client.query("select * from company ;",function(err,companys){
        if(err) throw err;

        client.query("select * from vanuser where id != 'admin@admin.com';",function(errs,cdetails){
          if(errs || cdetails.rows == ""){
            total=[]
            res.render('page/viewprofile',{shemaUser,total});
          }
          else{
            cdetail = cdetails.rows;
            company = companys.rows;
           // console.log(cdetail[0].urlimg);
            //loop push data to array
              for(var i = 0; i < cdetail.length; i++ ){
                //console.log(i);
               genshema(i);
               if(i==cdetail.length-1){
                 console.log(total);
                  res.render('page/viewprofile',{shemaUser,total});
                  // console.log(total);
                }
              }
          }//
          });
        shemaUser.company = "admin";

      });
      //res.render('page/viewprofile',{shemaUser,total});
  })
   router.get('/delete',function(req,res){
    console.log(req.query.key);
    var shemadata=total[req.query.key];
     console.log("DELETE FROM round_company WHERE  cname ='"+shemadata.name+"';");
         client.query("DELETE FROM round_company WHERE  cname ='"+shemadata.name+"';",function(err,company){
        if(err) {
          console.log("delete round_company err");
          console.log(err);
        }
      });
        client.query("DELETE FROM cdetail WHERE  cname ='"+shemadata.name+"';",function(err,company){
        if(err) {
          console.log("delete cdetail err");
          console.log(err);
        }
        });
      client.query("DELETE FROM company WHERE name ='"+shemadata.name+"';",function(err,company){
        if(err) {
          console.log("delete route err");
          console.log(err);
        }
        });

          client.query("DELETE FROM vanuser WHERE id ='"+shemadata.id+"';",function(err,company){
        if(err){
          console.log("delete vanuser  err");
          console.log(err);

        }
        });


    res.redirect('/viewprofile');
   // res.render('page/details',{shemaUser,shemadata});
  })

  app.use('/viewprofile',router)
}
