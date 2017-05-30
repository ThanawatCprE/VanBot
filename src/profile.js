
// var data;
// var x;
var shemaUser ={
  userImg :"",
  company : ""
}
var shemaDetails={}
function genshema(i){
  // setTimeout(function(){
    var shemaDetail = `{
      "urlimg" : "`+cdetail[i].cimage+`",
      "route" : "`+cdetail[i].rcompany+`",
      "cost" : "`+cdetail[i].cost+`",
      "time" : [`+time+`],
      "distance" : "`+distance+`",
      "phone" : "`+phone+`",
      "gps" : "`+cdetail[i].clocation+`"
    }`
    var shema = JSON.parse(shemaDetail);
    console.log(shema);
    pushdata(shema);
  // },200)
}
function pushdata(data){
  total.push(data);
}
function b(client,i,res){
  client.query("select * from round_company where cname ='"+cdetail[i].cname+"' and rcompany ='"+cdetail[i].rcompany+"';",function(errss,round){
    time=[];
    var rounds = round.rows
    // console.log(rounds);
    // console.log(cdetail);
    if(errss || round.rows == ""){
      time = "ไม่มีรอบเวลา"
      //  throw errss;
     }
     else{
        // time += rounds[0].time+"-"+rounds[rounds.length-1].time;
        time.push('"'+rounds[0].time+'"');
        time.push('"'+rounds[rounds.length-1].time+'"');
        var timeround = rounds[1].time-rounds[0].time
        console.log("sub",timeround.toFixed(2));
        if(timeround == 1){
          timeround = 60;
        }else{

        }
        time.push('"'+timeround.toFixed(2)+'"');
     }
    genshema(i)
    if(i==cdetail.length-1){
      console.log(total);
      res.render('page/profile',{shemaUser,total});
    }
  });
}
function a(client,i){
  client.query("select * from route where routing ='"+cdetail[i].rcompany+"';",function(errss,route){
    if(errss) throw errss;
    distance = route.rows[0].distance;
  });
}

function gettime(starts,ends,rounds,user,route){
  var start = parseFloat(starts)
  var end = parseFloat(ends)
  var round = parseFloat("0."+rounds)
  var track=0;
  var timezone=[]
  while(start<end){
    timezone.push(start.toFixed(2));
    track += round
    if(track == 0.60){
      track =0;
      start += 1;
      start = Math.floor(start);
    }
    else{
      start += track
    }
    // console.log(start,typeof(start));

  }
  var temp ="";
  for(var i=0;i<timezone.length;i++){
    if(i == timezone.length-1){
      temp += "('"+user+"','"+route+"','"+timezone[i]+"')"
    }else{
      temp += "('"+user+"','"+route+"','"+timezone[i]+"'),"
    }
  }
  return temp;
}
var total = [];
var cdetail
var time=[];
var distance;
var phone;
module.exports = function(app,express,session,auth,client){

  var router = express.Router();
  router.get('/',function(req,res){
    total = [];
    client.query("select * from vanuser where id ='"+req.session.email+"';",function(err,user){
      shemaUser.userImg = user.rows[0].urlimg ;

    })

      client.query("select * from company where owner ='"+req.session.email+"';",function(err,company){
        if(err) throw err;

        client.query("select * from cdetail where cname ='"+company.rows[0].name+"';",function(errs,cdetails){
          if(errs || cdetails.rows == ""){
            total=[]
            res.render('page/profile',{shemaUser,total});
          }
          else{
            cdetail = cdetails.rows;
            phone = company.rows[0].phone;
            //loop push data to array
              for(var i = 0; i < cdetail.length; i++ ){
                a(client,i);
                b(client,i,res);
              }
          }
          });
        shemaUser.company = company.rows[0].name;
      });
  })
  router.get('/edit',function(req,res){
    console.log(req.query.key);
    var shemadata=total[req.query.key];
    res.render('page/details',{shemaUser,shemadata});
  })
  router.get('/edit/save',function(req,res){
    var time = gettime(req.query.start,req.query.end,req.query.round,req.query.user,req.query.route);
    console.log(time);
    client.query("DELETE FROM round_company WHERE rcompany ='"+req.query.route+"' and cname ='"+req.query.user+"';",function(err,company){
      if(err) {
        console.log("delete round_company err");
        console.log(err);
      }
    });
    client.query("insert into round_company values"+time+";",function(errs,user){
          if(errs) throw errs;
          console.log("Add round_company .....................")
    })
     var temp = "update cdetail set cost ="+req.query.cost+" , cimage ="+"'"+req.query.image+"'"+",clocation ='"+req.query.GPS+"' where rcompany ='"+req.query.route+"';"

     client.query("insert into round_company values"+time+";",function(errs,user){
           if(errs) throw errs;
           console.log("Add round_company .....................")
     })
     client.query(temp,function(err,company){
         if(err) throw err;
       });
    temp = "update route set distance ="+req.query.distance+" where routing ='"+req.query.route+"';"
            console.log(temp);
    client.query(temp,function(err,company){
         if(err) throw err;
    });
    res.redirect('/profile');
  })
  router.get('/delete',function(req,res){
    console.log(req.query.key);
    var shemadata=total[req.query.key];
        client.query("DELETE FROM cdetail WHERE rcompany ='"+shemadata.route+"';",function(err,company){
        if(err){
          console.log("delete cdetail err");
          console.log(err);

        }
        });
        console.log("DELETE FROM round_company WHERE rcompany ='"+shemadata.route+"' and cname ='"+shemaUser.company+"';");
        client.query("DELETE FROM round_company WHERE rcompany ='"+shemadata.route+"' and cname ='"+shemaUser.company+"';",function(err,company){
        if(err) {
          console.log("delete round_company err");
          console.log(err);
        }
        });
    res.redirect('/profile');
   // res.render('page/details',{shemaUser,shemadata});
  })
  require('./add')(app,express,session,auth,client,shemaUser,gettime);
  app.use('/profile',auth,router)
}
