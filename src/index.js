const express =require('express');
const bodyPaser = require('body-parser');
const request = require('request');
const app =express();
const pg = require("pg");

const token = process.env.FB_VARIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

var client = new pg.Client({
  user: "ifeygszgzemhgc",
  password: "c6500d57a0d859b425fbf6808052bcf2d0955da468aa90ff069c6c9c85cc536f",
  database: "djmi984ka9f4r",
  port: 5432,
  host: "ec2-23-23-111-171.compute-1.amazonaws.com",
  ssl: true
});

client.connect();

var query = client.query('select * from company;');
var x=[];
query.on('row', function(row) {
  x.push(row.name)
  console.log(x);
  client.end();
});

app.set('port',(process.env.PORT || 5000))

app.use(bodyPaser.urlencoded({extended:false}));
app.use(bodyPaser.json())

app.get('/', function (req, res){
	res.send('hello ')
})
var test ={
	get_started:{
    "payload":"GET_STARTED_PAYLOAD"
  }
}
app.get('/webhook/', function(req, res ){
	if(req.query['hub.verify_token']=== token){
		res.send(req.query['hub.challenge'])
	}
	res.send('not entry');
})

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
var state = 1;
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;
  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (state) {
      case 1 :
        if(event.messageobj.text=='startchattingevent'){
          sendTextMessage(senderID);
          state =2;
        }
        break;
      case 2 :
        if(messageText.match(/ไป/g)&&messageText!="ไป"){
            sendQueueVan(senderID);
        }
        else{
          sendTextMessage(senderID);
        }
        break;
      default:
        // sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
			 "attachment":{
       "type":"template",
	       "payload":{
			 		"template_type":"generic",
					"elements":[{
						"title":"🚎 Vanbot พร้อมให้บริการครับ 🚩🚩 คุณต้องการจะเดินทางไปที่ไหน ❓❓",
						"subtitle":"ตัวอย่างการใส่ข้อมูล ❗❗\r\n< กรุงเทพไปชลบุรี > หรือ เลือกจากปุ่มด้านล่าง",
			 			"image_url":"https://scontent.fbkk2-1.fna.fbcdn.net/v/t1.0-9/18058138_1689678951326816_1841996356629707121_n.png?oh=08a8d4dab68a902db65b0fe5d8e5e0d9&oe=59898F34"
			 		}]
	       }
    	 },
		// 	"text":"ตอนนี้อยู่ที่ไหน:",
     "quick_replies":[
       {
         "content_type":"text",
         "title":"กรุงเทพไปสระบุรี",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
       },
       {
         "content_type":"text",
         "title":"กรุงเทพไปลพบุรี",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
       },
       {
         "content_type":"text",
         "title":"กรุงเทพไปสิงห์บุรี",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
       },
       {
         "content_type":"text",
         "title":"กรุงเทพไปนครสวรรค์",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
       }
      ]
		}
  };

  callSendAPI(messageData);
}


function sendQueueVan(recipientId) {
  var genneral_message =`
  {
    "recipient": {
      "id": `+recipientId+`
    },
    "message": {
       "attachment":{
         "type":"template",
           "payload":{
            "template_type":"generic",
            "elements":[`+genneral_template(3)+`]
           }
        }
      }
  }`
  var myObj = JSON.parse(genneral_message);
  var messageData = myObj;
  callSendAPI(messageData);
}

function genneral_template(data){
  var temp = '';
  for(var i=0;i<data;i++){
    temp +=`{
      "title":"🚎 ชนิกาทัวร์ กรุงเทพไปนครสวรรค์ 🚩",
      "subtitle":"🏤 สถานที่จำหน่ายตั๋ว: หมอชิต2\\r\\n🕑 รอบ: 8.00น.\\r\\n💵 ราคา: 100 บาท ",
      "image_url":"https://scontent.fbkk2-1.fna.fbcdn.net/v/t1.0-9/18058138_1689678951326816_1841996356629707121_n.png?oh=08a8d4dab68a902db65b0fe5d8e5e0d9&oe=59898F34",
      "buttons":[
        {
          "type":"web_url",
          "title":"📍 ตรวจสอบตำแหน่ง",
          "url":"https://www.google.co.th/maps/place/%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%AB%E0%B8%A1%E0%B8%AD%E0%B8%8A%E0%B8%B4%E0%B8%95/@13.8024444,100.5515614,17z/data=!3m1!4b1!4m5!3m4!1s0x30e29c40744d242d:0xea6ffad652c3aefc!8m2!3d13.8024392!4d100.5537501?hl=th&authuser=0"
        },{
          "type":"phone_number",
          "title":"📞 ติดต่อ",
          "payload":"0856970832"
        }
        ]
    }`
    if(i<data-1) temp+=',';
  }
  return temp;
}
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

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
