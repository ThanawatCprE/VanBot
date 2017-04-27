const express =require('express');
const bodyPaser = require('body-parser');
const request = require('request');
const app =express();
// const pg = require("pg");

const token = process.env.FB_VARIFY_TOKEN
const access = process.env.FB_ACCEESS_TOKEN

// var client = new pg.Client({
//   user: "wvlwhwidwfqdmd",
//   password: "56d5dd8fbd584752d66eb7928c66baa555091e372f13c855cecc67d51bff5ad1",
//   database: "da4u7s2l8djveh",
//   port: 5432,
//   host: "ec2-54-243-107-66.compute-1.amazonaws.com",
//   ssl: true
// });

// client.connect();
//
// var query = client.query('select * from queue;');
// var x;
// query.on('row', function(row) {
//   x = row.name
//   client.end();
// });

app.set('port',(process.env.PORT || 5000))

app.use(bodyPaser.urlencoded({extended:false}));
app.use(bodyPaser.json())

app.get('/', function (req, res){
	res.send('hello ')
})
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
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
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
						"title":"🚎สวัสดีครับVanbotพร้อมให้บริการ🚎 คุณต้องการจะเดินทางไปที่ไหน ❓❓",
						"subtitle":"ตัวอย่างการใสข้อมูล ❗❗ < กรุงเทพไปชลบุรี > หรือ เลือกจากปุ่มด้านล่าง",
			 			"image_url":"https://scontent.fbkk2-1.fna.fbcdn.net/v/t1.0-9/18058138_1689678951326816_1841996356629707121_n.png?oh=08a8d4dab68a902db65b0fe5d8e5e0d9&oe=59898F34"
			 		}]
	       }
    	 },
		// 	"text":"ตอนนี้อยู่ที่ไหน:",
     "quick_replies":[
       {
         "content_type":"text",
         "title":"กรุงเทพไปชลบุรี",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
         "image_url":"https://www.w3schools.com/css/trolltunga.jpg"
       },
       {
         "content_type":"text",
         "title": "test" ,
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
		 	,
       {
         "content_type":"text",
         "title":"จันทบุรีไปอุดรธานี",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
		 	,
       {
         "content_type":"text",
         "title":"เชียงใหม่ไปนครนายก",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
		 	,
       {
         "content_type":"text",
         "title":"ปทุมธานีไปกรุงเทพ",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
		 	,
       {
         "content_type":"text",
         "title":"พัทลุงไปเชียงราย",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
		 	,
       {
         "content_type":"text",
         "title":"ชลบุรีไปแม่ฮ่องสอน",
         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
         "image_url":"http://petersfantastichats.com/img/green.png"
       }
   	]

		}
  };

  callSendAPI(messageData);
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
function callSendAP(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
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
// 	"setting_type" : "call_to_actions",
//   "thread_state" : "existing_thread",
//   "call_to_actions":[
//     {
//       "type":"postback",
//       "title":"Help",
//       "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
//     },
//     {
//       "type":"postback",
//       "title":"Start a New Order",
//       "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
//     },
//     {
//       "type":"web_url",
//       "title":"Checkout",
//       "url":"https://petersapparel.parseapp.com/checkout",
//       "webview_height_ratio": "full",
//       "messenger_extensions": true
//     },
//     {
//       "type":"web_url",
//       "title":"View Website",
//       "url":"https://petersapparel.parseapp.com/"
//     }
//   ]
// };
// callThreadSettingsAPI(data);
// }
app.listen(app.get('port'),function(){
	// createGetStarted();
	console.log('runing on port',app.get('port'))
})
