module.exports = function(app,client,token,access,bodyPaser,request){
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
            if(event.postback && event.postback.payload == "GET_STARTED_PAYLOAD" )
              {
                      //present user with some greeting or call to action
                      var msg = "พิมข้อความ 'ช่วยด้วย' เพื่อเปิดใช้งาน VanBOT 🚎"
                      sendGetstart(event.sender.id,msg);
              }
            console.log("Webhook received unknown event: ", event);
          }
        });
      });
      res.sendStatus(200);
    }
  });

  var state = 1;
  var json;
  function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log("time-----------:"+timeOfMessage);
    // console.log("Received message for user %d and page %d at %d with message:",
    //   senderID, recipientID, timeOfMessage);
    // console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;
    if (messageText) {

      // If we receive a text message, check to see if it matches a keyword
      // and send back the example. Otherwise, just echo the text we received.
      switch (state) {
        case 1 :
  				// json=[];
  				 phone=[];
  				 round=[];

          if(messageText == "ช่วยด้วย" ){
            sendTextMessage(senderID);
            state = 2;
          }else{
            var msg = "พิมข้อความ 'ช่วยด้วย' เพื่อเปิดใช้งาน VanBOT 🚎"
            sendGetstart(senderID,msg);
          }
          break;
        case 2 :
          if(messageText.match(/ไป/g)&&messageText!="ไป"){
              MainQuery(client,messageText);
              sendQueueVan(senderID);
               state = 1;
          }
          else{
              sendTextMessage(senderID);
          }
          break;
        default:
          // sendTextMessage(senderID, messageText);
      }
    } else if (messageAttachments) {
      // sendTextMessage(senderID, "Message with attachment received");
    }
  }

  function sendGetstart(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        "text":messageText
      }
    };
    callSendAPI(messageData);
  }

  function sendTextMessage(recipientId) {
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
  	setTimeout(function(){
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
  	            "elements":[`+genneral_template(json)+`]
  	           }
  	        }
  	      }
  	  }`
  		var myObj = JSON.parse(genneral_message);
  		var messageData = myObj;
  	  callSendAPI(messageData);
  	},200);
  }
  // "title":"🚎 ชนิกาทัวร์ กรุงเทพไปนครสวรรค์ 🚩",
  function genneral_template(data){
    var temp = '';
    for(var i=0;i<data.length;i++){
      temp +=`{
        "title":"🚎 `+data[i].cname+` `+data[i].rcompany+` 🚩",
        "subtitle":"🏤 ระยะทาง: `+distance+` กม.\\r\\n🕑 รอบ: `+round[i]+`\\r\\n💵 ราคา: `+data[i].cost+` บาท ",
        "image_url":"`+data[i].cimage+`",
        "buttons":[
          {
            "type":"web_url",
            "title":"📍 ตรวจสอบตำแหน่ง",
            "url":"`+data[i].clocation+`"
          },{
            "type":"phone_number",
            "title":"📞 ติดต่อ",
            "payload":"`+phone[i]+`"
          }
          ]
      }`
      if(i<data.length-1) temp+=',';
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

  function MainQuery(client,temp){
  	json=[]
  	DistanceQuery(client,temp)
    client.query("select * from cdetail where rcompany ='"+temp+"';",function(err,rows,fields){
      if (err) throw err;
      json=rows.rows
  		console.log(json);
  		for(var i=0;i<json.length;i++){
  		 	PhoneQuery(client,json[i].cname);
  			TimeQuery(client,json[i].cname,temp);
  		}
  		console.log(phone);
      // client.end();
    })
  }

  var phone=[];
  var distance;
  var round=[];
  var date = new Date();
  var timeNow=(date.getHours()+7)+'.'+date.getMinutes()
  console.log('bdf'+timeNow);
  function PhoneQuery(callback,temp){
    callback.query("select phone from company where name ='"+temp+"';",function(err,rows,fields){
      if (err) throw err;
      phone.push(rows.rows[0].phone);
  		console.log(phone);
    })
  }

  function TimeQuery(callback,company,route){
  	callback.query("select time from round_company where cname ='"+company+"' and rcompany ='"+route+"';",function(err,rows,fields){
  	 	 	if (err) throw err;
  		 	 var timeRound = rows.rows;
  			 if(timeRound.length!=0){
  			 	 for(var i=0;i<timeRound.length;i++){
  			 		 var subtract =  timeNow - timeRound[i].time
  					 console.log('subtract : '+subtract);
  			 		 if(subtract<0){
  			 			 round.push(timeRound[i].time+'น.');
  			 			 break;
  			 		 	}
  			 		else if(subtract<=0.06 && subtract >= 0){
  			 			 round.push(timeRound[i].time+'น.');
  			 			 break;
  			 		 	}
  			 	 	else if(subtract>0.06&&i==timeRound.length-1){
  			 			 round.push('เกินช่วงเวลา');
  			 			 break;
  			 	 		}
  			 	}
  			}
  			else{
  				round.push('เกินช่วงเวลา');
  			}
  	  })
   }

  function DistanceQuery(callback,temp){
  	distance='';
    callback.query("select distance from route where routing ='"+temp+"';",function(err,rows,fields){
      if (err) throw err;
      distance=rows.rows[0].distance;
    })
  }
}
