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

//-----------------------------------ส่วนของเมนู ความรู้ทั่วไป-----------------------------------------//

    // ทำ function knowledge เพื่อแสดงผลบางอย่างกลับไปที่หน้าจอของ bot ------ [1]
    const knowledge = async agent => {
        // เพิ่ม flex message แสดงความรู้ทั่วไป
        const carouselMsg = {
            "type": "template",
            "altText": "เลือกประเภทข้าวโพด",
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

      // แสดงรายละเอียดแต่ละหัวข้อที่ผู้ใช้เลือก [1.1]
    const knowledge_select = async => {
      let knowledge_s = req.body.queryResult.parameters.knowledge_select;
      if (knowledge_s === "การเลือกพื้นที่ข้าวโพดเลี้ยงสัตว์") {
        return db.collection('Knowledge').doc('Maize corn').get().then(doc => {
          agent.add(doc.data().area);
        });
      }
      else if (knowledge_s === "การเตรียมดินข้าวโพดเลี้ยงสัตว์") {
        return db.collection('Knowledge').doc('Maize corn').get().then(doc => {
          agent.add(doc.data().soil);
        });
      }
      else if (knowledge_s === "การให้น้ำข้าวโพดเลี้ยงสัตว์") {
        return db.collection('Knowledge').doc('Maize corn').get().then(doc => {
          agent.add(doc.data().irrigation);
        });
      }
      else if (knowledge_s === "การเลือกพื้นที่ข้าวโพดหวาน") {
        return db.collection('Knowledge').doc('Sweet corn').get().then(doc => {
          agent.add(doc.data().area);
        });
      }
      else if (knowledge_s === "การเตรียมดินข้าวโพดหวาน") {
        return db.collection('Knowledge').doc('Sweet corn').get().then(doc => {
          agent.add(doc.data().soil);
        });
      }
      else if (knowledge_s === "การให้น้ำข้าวโพดหวาน") {
        return db.collection('Knowledge').doc('Sweet corn').get().then(doc => {
          agent.add(doc.data().irrigation);
        });
      }
      else if (knowledge_s === "การเลือกพื้นที่ข้าวโพดฝักอ่อน") {
        return db.collection('Knowledge').doc('Baby corn').get().then(doc => {
          agent.add(doc.data().area);
        });
      }
      else if (knowledge_s === "การเตรียมดินข้าวโพดฝักอ่อน") {
        return db.collection('Knowledge').doc('Baby corn').get().then(doc => {
          agent.add(doc.data().soil);
        });
      }
      else if (knowledge_s === "การให้น้ำข้าวโพดฝักอ่อน") {
        return db.collection('Knowledge').doc('Baby corn').get().then(doc => {
          agent.add(doc.data().irrigation);
        });
      }
    }


//-----------------------------------ส่วนของเมนู โรคพืช-----------------------------------------//

    // function disease action แรกของเมนู โรคพืช [2]
    const disease = async agent => {
      const buttonMsg = {
        "type": "flex",
        "altText": "Flex Message",
        "contents": {
          "type": "bubble",
          "direction": "ltr",
          "header": {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "กรุณาเลือก",
                "size": "md",
                "align": "center",
                "gravity": "center",
                "color": "#000000"
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "แสดงโรคทั้งหมด",
                      "text": "แสดงโรคทั้งหมด"
                    },
                    "height": "sm",
                    "gravity": "center"
                  },
                  {
                    "type": "separator"
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "เลือกอาการ",
                      "text": "เลือกอาการ"
                    },
                    "height": "sm",
                    "gravity": "center"
                  },
                  {
                    "type": "separator"
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "ระบุอาการ",
                      "text": "ระบุอาการ"
                    },
                    "height": "sm",
                    "gravity": "center"
                  }
                ]
              }
            ]
          }
        }
      };

      const payloadMsg = new Payload("LINE", buttonMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
    }

    // ส่วน function disease_carousel แสดงโรคทั้งหมดที่มีในระบบ ------ [2.1]
    const disease_carousel = async => {
      // เพิ่ม flex message แสดงโรคข้าวโพด
      const carouselMsg = {
        "type": "template",
        "altText": "เลือกโรคข้าวโพด",
        "template": {
          "type": "carousel",
          "actions": [],
          "columns": [
            {
              "thumbnailImageUrl": "https://i.ibb.co/S5rzJjQ/Corn-Downy-Mildew.png",
              "title": "โรคราน้ำค้าง หรือโรคใบลาย",
              "text": "โรคราน้ำค้าง หรือโรคใบลาย (Corn Downy Mildew)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคราน้ำค้าง"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการโรคราน้ำค้าง"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคราน้ำค้าง"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.ibb.co/qRW5gvr/Southern-or-Maydis-Leaf-Blight.png",
              "title": "โรคใบไหม้แผลเล็ก",
              "text": "โรคใบไหม้แผลเล็ก  (Southern or Maydis LeafBlight)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคใบไหม้แผลเล็ก"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการโรคใบไหม้แผลเล็ก"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคใบไหม้แผลเล็ก"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://www.aggrogroups.com/images/contents/news/pest-problem/corn-southern-rust/549.jpg",
              "title": "โรคราสนิม",
              "text": "โรคราสนิม (Southern Corn Rust)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคราสนิม"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการโรคราสนิม"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคราสนิม"
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
    }

    // แสดงรายละเอียดของโรคแต่ละหัวข้อที่ผู้ใช้เลือก
    const disease_select = async => {
      let disease_s = req.body.queryResult.parameters.disease_select;
      if (disease_s === "สาเหตุของโรคราน้ำค้าง") {
        return db.collection('Disease').doc('Downy Mildew').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคราน้ำค้าง") {
        return db.collection('Disease').doc('Downy Mildew').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคราน้ำค้าง") {
        return db.collection('Disease').doc('Downy Mildew').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "สาเหตุของโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('Southern Corn Leaf Blight').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('Southern Corn Leaf Blight').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('Southern Corn Leaf Blight').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "สาเหตุของโรคราสนิม") {
        return db.collection('Disease').doc('Southern Corn Rust').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคราสนิม") {
        return db.collection('Disease').doc('Southern Corn Rust').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคราสนิม") {
        return db.collection('Disease').doc('Southern Corn Rust').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
    }

    // ส่วน function disease_imagemap ให้ผู้ใช้กดเลือกอาการจากแผนภาพเพื่อหาโรคที่เข้าข่าย ------ [2.2]
    const disease_imagemap = async => {
      // แสดงส่วนที่เกิดโรค
      /*const textMsg = {
        "type": "text",
        "text": "เกิดโรคที่ส่วนไหนคะ"
      }*/
      const imagemapMsg = {
        "type": "imagemap",
        "baseUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/104.png?alt=media&token=332ec3fb-c09b-47e5-bf58-bf5c34e9e562#?width=auto",
        "altText": "This is an imagemap",
        "baseSize": {
          "width": 1040,
          "height": 1040
        },
        "actions": [
          {
            "type": "message",
            "area": {
              "x": 0,
              "y": 0,
              "width": 518,
              "height": 342
            },
            "text": "ฝัก"
          },
          {
            "type": "message",
            "area": {
              "x": 523,
              "y": 0,
              "width": 517,
              "height": 343
            },
            "text": "โคนต้น"
          },
          {
            "type": "message",
            "area": {
              "x": 0,
              "y": 343,
              "width": 518,
              "height": 349
            },
            "text": "กาบใบ"
          },
          {
            "type": "message",
            "area": {
              "x": 523,
              "y": 347,
              "width": 517,
              "height": 349
            },
            "text": "เปลือกฝัก"
          },
          {
            "type": "message",
            "area": {
              "x": 0,
              "y": 699,
              "width": 516,
              "height": 341
            },
            "text": "ลำต้น"
          },
          {
            "type": "message",
            "area": {
              "x": 523,
              "y": 699,
              "width": 517,
              "height": 341
            },
            "text": "ใบ"
          }
        ]
      }

      const payloadMsg = new Payload("LINE", imagemapMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
    }

    //แสดงอาการให้ผู้ใช้เลือก
    const disease_imagemap_part = async => {
      let disease_part = req.body.queryResult.parameters.part;
      if (disease_part == "ฝัก"){
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีจุด",
                        "text": "ฝักมีจุด"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "แผล",
                        "text": "ฝักมีแผล"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ซีดเหลือง",
                        "text": "ฝักซีดเหลือง"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีราขาว",
                        "text": "ฝักมีราขาว"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ฝักเน่า",
                        "text": "ฝักเน่า"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เมล็ดสีดำ",
                        "text": "เมล็ดสีดำ"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีเส้นใย",
                        "text": "ฝักมีเส้นใย"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีปม",
                        "text": "ฝักมีปม"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "ไม่มีเมล็ด/เมล็ดน้อย",
                    "text": "ไม่มีเมล็ด/เมล็ดน้อย"
                  }
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
      else if (disease_part == "โคนต้น"){
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "แผลช้ำ",
                        "text": "โคนต้นมีแผลช้ำ"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "โคนต้นแตก",
                        "text": "โคนต้นแตก"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีน้ำเมือก",
                        "text": "โคนต้นมีน้ำเมือก"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "โคนหักล้ม",
                        "text": "โคนหักล้ม"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีกลิ่นเหม็น",
                        "text": "โคนต้นมีกลิ่นเหม็น"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ซีดเหลือง",
                        "text": "โคนต้นซีดเหลือง"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
      else if (disease_part == "กาบใบ"){
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีจุด",
                        "text": "กาบใบมีจุด"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีแผล",
                        "text": "กาบใบมีแผล"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ซีดเหลือง",
                        "text": "กาบใบซีดเหลือง"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
      else if (disease_part == "เปลือกฝัก"){
        const buttonMsg = {
          "type": "template",
          "altText": "this is a image carousel template",
          "template": {
              "type": "image_carousel",
              "columns": [
                  {
                    "imageUrl": "https://example.com/bot/images/item1.jpg",
                    "action": {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=111"
                    }
                  },
                  {
                    "imageUrl": "https://example.com/bot/images/item2.jpg",
                    "action": {
                      "type": "message",
                      "label": "Yes",
                      "text": "yes"
                    }
                  },
                  {
                    "imageUrl": "https://example.com/bot/images/item3.jpg",
                    "action": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/222"
                    }
                  }
              ]
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
      else if (disease_part == "ลำต้น"){
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีจุด",
                        "text": "ลำต้นมีจุด"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ต้นเน่า",
                        "text": "ลำต้นเน่า"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เหี่ยวแห้ง",
                        "text": "ลำต้นเหี่ยวแห้ง"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีแผล",
                        "text": "ลำต้นมีแผล"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "กลวงเป็นโพรง",
                        "text": "กลวงเป็นโพรง"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
      else if (disease_part == "ใบ"){
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ใบไหม้",
                        "text": "ใบไหม้"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "แผล",
                        "text": "ใบมีแผล"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ซีดเหลือง",
                        "text": "ใบซีดเหลือง"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ใบแห้ง",
                        "text": "ใบแห้ง"
                      }
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีจุด",
                        "text": "ใบมีจุด"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีปม",
                        "text": "ใบมีปม"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
    }
    
    const leaf_select = async => {
      let leaf_symptom = req.body.queryResult.parameters.Leaf_symptom;
      if (leaf_symptom == "ใบไหม้") {
        return agent.add(leaf_symptom);
      }
      else if (leaf_symptom == "ใบมีแผล") {
        return agent.add(leaf_symptom);
      }
      else if (leaf_symptom == "ใบซีดเหลือง") {
        return agent.add(leaf_symptom);
      }
      else if (leaf_symptom == "ใบแห้ง") {
        return agent.add(leaf_symptom);
      }
      else if (leaf_symptom == "ใบมีจุด") {
        return agent.add(leaf_symptom);
      }
      else if (leaf_symptom == "ใบมีปม") {
        const buttonMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ปมสีขาว",
                        "text": "ปมสีขาว"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ปมสีดำคล้ำ",
                        "text": "ปมสีดำคล้ำ"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
          });
          return agent.add(payloadMsg);
      }
    }


    let intentMap = new Map();
    // knowledge
    intentMap.set("Knowledge", knowledge);

    // Knowledge - Select
    intentMap.set('Knowledge - Select', knowledge_select);

    // Disease
    intentMap.set('Disease', disease);

    // Disease Carousel
    intentMap.set('Disease Carousel', disease_carousel);

    // Disease Carousel - Select
    intentMap.set('Disease Carousel - Select', disease_select);

    // Disease Imagemap
    intentMap.set('Disease Imagemap', disease_imagemap);

    // Disease Imagemap - Part
    intentMap.set('Disease Imagemap - Select Part', disease_imagemap_part);

    // Disease Leaf - Select Symptom
    intentMap.set('Leaf - Select Symptom', leaf_select);

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
