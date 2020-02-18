const functions = require('firebase-functions');
const request = require("request-promise");
const config = require("./config.json");

const { WebhookClient, Payload } = require("dialogflow-fulfillment");

const firebase = require("firebase-admin");
firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL: config.databaseURL
});
var db = firebase.firestore();

const region = "asia-east2";
const runtimeOptions = {
  timeoutSeconds: 4,
  memory: "2GB"
};

exports.webhook = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    console.log("LINE REQUEST BODY", JSON.stringify(req.body));

    const agent = new WebhookClient({ request: req, response: res });

    // ทำ function knowledge เพื่อแสดงผลบางอย่างกลับไปที่หน้าจอของ bot
    const knowledge = async agent => {
        // เพิ่ม flex message
        const carouselMsg = {
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": "https://i.ibb.co/MMCGQW0/image.jpg",
                  "title": "ข้าวโพดเลี้ยงสัตว์",
                  "text": "ความรู้ทั่วไป",
                  "actions": [
                    {
                      "type": "message",
                      "label": "การเลือกพื้นที่",
                      "text": "การเลือกพื้นที่ข้าวโพดเลี้ยงสัตว์"
                    },
                    {
                      "type": "message",
                      "label": "การเตรียมดิน",
                      "text": "การเตรียมดินข้าวโพดเลี้ยงสัตว์"
                    },
                    {
                      "type": "message",
                      "label": "การให้น้ำ",
                      "text": "การให้น้ำข้าวโพดเลี้ยงสัตว์"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://i.ibb.co/GP4kDjW/sweet-corn.jpg",
                  "title": "ข้าวโพดหวาน",
                  "text": "ความรู้ทั่วไป",
                  "actions": [
                    {
                      "type": "message",
                      "label": "การเลือกพื้นที่",
                      "text": "การเลือกพื้นที่ข้าวโพดหวาน"
                    },
                    {
                      "type": "message",
                      "label": "การเตรียมดิน",
                      "text": "การเตรียมดินข้าวโพดหวาน"
                    },
                    {
                      "type": "message",
                      "label": "การให้น้ำ",
                      "text": "การให้น้ำข้าวโพดหวาน"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://i.ibb.co/kBhwmHW/image.jpg",
                  "title": "ข้าวโพดฝักอ่อน",
                  "text": "ความรู้ทั่วไป",
                  "actions": [
                    {
                      "type": "message",
                      "label": "การเลือกพื้นที่",
                      "text": "การเลือกพื้นที่ข้าวโพดฝักอ่อน"
                    },
                    {
                      "type": "message",
                      "label": "การเตรียมดิน",
                      "text": "การเตรียมดินข้าวโพดฝักอ่อน"
                    },
                    {
                      "type": "message",
                      "label": "การให้น้ำ",
                      "text": "การให้น้ำข้าวโพดฝักอ่อน"
                    }
                  ]
                }
              ]
            }
          };

        const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
        });
        return agent.add(payloadMsg);
      };

    let intentMap = new Map();
    intentMap.set("Knowledge", knowledge);
    agent.handleRequest(intentMap);

  });

//function สำหรับ reply กลับไปหา LINE โดยต้องการ reply token และ messages (array)
const lineReply = (replyToken, messages) => {
  const body = {
    replyToken: replyToken,
    messages: messages
  };
  return request({
    method: "POST",
    uri: `${config.lineMessagingApi}/reply`,
    headers: config.lineHeaders,
    body: JSON.stringify(body)
  });
};
