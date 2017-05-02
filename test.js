var pg = require("pg");

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
client.query("select cname from cdetail;",function(err,rows,fields){
  if (err) throw err;
  json=rows.rows
  console.log(json[0]);
  client.end();
})

// var query = client.query('select * from company;');
//
// query.on('row', function(row) {
//   var x = row.name
//   console.log(x);
//   client.end();
// });

// query.on('end');
