var pg = require("pg");
function test(){
  var client = new pg.Client({
    user: "ifeygszgzemhgc",
    password: "c6500d57a0d859b425fbf6808052bcf2d0955da468aa90ff069c6c9c85cc536f",
    database: "djmi984ka9f4r",
    port: 5432,
    host: "ec2-23-23-111-171.compute-1.amazonaws.com",
    ssl: true
  });
  var json='';
  client.connect();
  client.query("select * from company where name = 'ชนิกาทัวร์' ;",function(err,rows,fields){
    if (err) throw err;
    json=JSON.stringify(rows.rows)
    // console.log(json);
    return json;
    client.end();
  })

}
var x = test();
console.log(x);
// console.log(test());
// var query = client.query('select * from company;');
//
// query.on('row', function(row) {
//   var x = row.name
//   console.log(x);
//   client.end();
// });

// query.on('end');
// https://scontent.fbkk2-1.fna.fbcdn.net/v/t1.0-9/18058138_1689678951326816_1841996356629707121_n.png?oh=08a8d4dab68a902db65b0fe5d8e5e0d9&oe=59898F34
//
// https://www.google.co.th/maps/place/%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%AB%E0%B8%A1%E0%B8%AD%E0%B8%8A%E0%B8%B4%E0%B8%95/@13.8024444,100.5515614,17z/data=!3m1!4b1!4m5!3m4!1s0x30e29c40744d242d:0xea6ffad652c3aefc!8m2!3d13.8024392!4d100.5537501?hl=th&authuser=0
