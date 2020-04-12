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
              "thumbnailImageUrl": "https://i.ibb.co/S5rzJjQ/Corn-Downy-Mildew.png",
              "title": "โรคสมัท หรือ",
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
        return db.collection('Disease').doc('DownyMildew').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคราน้ำค้าง") {
        return db.collection('Disease').doc('DownyMildew').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคราน้ำค้าง") {
        return db.collection('Disease').doc('DownyMildew').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "สาเหตุของโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('SouthernCornLeafBlight').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('SouthernCornLeafBlight').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('SouthernCornLeafBlight').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "สาเหตุของโรคราสนิม") {
        return db.collection('Disease').doc('SouthernCornRust').get().then(doc => {
          agent.add(doc.data().cause);
        });
      }
      else if (disease_s === "อาการโรคราสนิม") {
        return db.collection('Disease').doc('SouthernCornRust').get().then(doc => {
          agent.add(doc.data().symptom);
        });
      }
      else if (disease_s === "การป้องกันโรคราสนิม") {
        return db.collection('Disease').doc('SouthernCornRust').get().then(doc => {
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
      if (disease_part === "ฝัก") {
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
                        "label": "มีแผล",
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
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เมล็ดสีดำ",
                        "text": "เมล็ดสีดำ"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เมล็ดน้อย",
                        "text": "เมล็ดน้อย"
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
                    "label": "ไม่มีเมล็ด",
                    "text": "ไม่มีเมล็ด"
                  }
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
        });
        return agent.add("เลือกอาการที่เกิดที่ฝัก"), agent.add(payloadMsg);
      }

      else if (disease_part === "โคนต้น") {
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
        return agent.add("เลือกอาการที่เกิดที่โคนต้น"), agent.add(payloadMsg);
      }

      else if (disease_part === "กาบใบ") {
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
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ซีดเหลือง",
                        "text": "กาบใบซีดเหลือง"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "แห้ง",
                        "text": "กาบใบแห้ง"
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
        return agent.add("เลือกอาการที่เกิดที่กาบใบ"), agent.add(payloadMsg);
      }

      else if (disease_part === "เปลือกฝัก") {
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
        return agent.add("เลือกอาการที่เกิดที่เปลือกฝัก"), agent.add(payloadMsg);
      }

      else if (disease_part === "ลำต้น") {
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
        return agent.add("เลือกอาการที่เกิดที่ลำต้น"), agent.add(payloadMsg);
      }

      else if (disease_part === "ใบ") {
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
                        "label": "มีฝุ่นขาว",
                        "text": "ใบมีฝุ่นขาว"
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
                        "label": "มีปม",
                        "text": "ใบมีปม"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีจุด",
                        "text": "ใบมีจุด"
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
                        "label": "มีแผลตามทางยาว",
                        "text": "ใบมีแผลตามทางยาว"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "มีแผลช้ำ/ฉ่ำน้ำ",
                        "text": "ใบมีแผลฉ่ำน้ำ"
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
        return agent.add("เลือกอาการที่เกิดที่ใบ"), agent.add(payloadMsg);
      }
    };


    const ear_select = async => {
      let ear_symptom = req.body.queryResult.parameters.Ear_symptom;
      if (ear_symptom === "ฝักมีจุด") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('spot').get()
          .then(doc => {
              /*agent.add(doc.data().diseaseNameTH['brown'])
            });*/
            
            /*doc => {
            doc.forEach(doc => agent.add(doc.data()))*/
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": ear_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": ear_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": ear_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักมีแผล") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('lesion').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": ear_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('yellow').get().then(doc => {
          let carouselMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Body",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[0]}`,
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[0]}`,
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[1]}`,
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[1]}`,
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (ear_symptom === "ฝักมีราขาว") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('fungus').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": ear_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักเน่า") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('rot').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": ear_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "เมล็ดสีดำ") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('black-kernel').get().then(doc => {
          let carouselMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Body",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[0]}`,
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[0]}`,
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[1]}`,
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[1]}`,
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (ear_symptom === "ฝักมีปม") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('gall').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": ear_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ไม่มีเมล็ด" || ear_symptom === "เมล็ดน้อย") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('stunt').get().then(doc => {
          let carouselMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": ear_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
    }


    const basal_select = async => {
      let basal_symptom = req.body.queryResult.parameters.Basal_symptom;
      if (basal_symptom === "โคนต้นแตก") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('split').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นมีแผลช้ำ") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('water-soaked').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": basal_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['dark brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['dark brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": basal_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['reddish brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['reddish brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": basal_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['grayish green']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['grayish green']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
        /*const buttonMsg = {
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
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "สีน้ำตาลเข้ม",
                    "text": "โคนต้นมีแผลช้ำสีน้ำตาลเข้ม"
                  }
                },
                {
                  "type": "separator"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "สีน้ำตาลแดง",
                    "text": "โคนต้นมีแผลช้ำสีน้ำตาลแดง"
                  }
                },
                {
                  "type": "separator"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "สีเขียวอมเทา",
                    "text": "โคนต้นมีแผลช้ำสีเขียวอมเทา"
                  }
                }
              ]
            }
          }
        }
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
        });
        return agent.add("แผลช้ำที่โคนมีสีอะไรคะ"), agent.add(payloadMsg);*/
      }
      else if (basal_symptom === "โคนต้นมีน้ำเมือก") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('slime').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนหักล้ม") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('fall-over').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นมีกลิ่นเหม็น") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('smell').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('yellow').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }
    /*const basal_ws = async => {
      let basal_ws_colour = req.body.queryResult.parameters.Basal_symptom_ws;
      if (basal_ws_colour === "โคนต้นมีแผลช้ำสีน้ำตาลแดง") {
        return db.doc('Symptom_disease/Basal/symptom/water-soaked/colour/reddish brown').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_ws_colour,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_ws_colour === "โคนต้นมีแผลช้ำสีน้ำตาลเข้ม") {
        return db.doc('Symptom_disease/Basal/symptom/water-soaked/colour/dark brown').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_ws_colour,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_ws_colour === "โคนต้นมีแผลช้ำสีเขียวอมเทา") {
        return db.doc('Symptom_disease/Basal/symptom/water-soaked/colour/grayish green').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": basal_ws_colour,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }*/


    const leaf_sheath_select = async => {
      let leaf_sheath_symptom = req.body.queryResult.parameters.Leaf_sheath_symptom;
      if (leaf_sheath_symptom === "กาบใบมีจุด") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('spot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_sheath_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_sheath_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_sheath_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['water-soaked']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['water-soaked']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบมีแผล") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('lesion').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_sheath_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_sheath_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบซีดเหลือง") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('yellow').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_sheath_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบแห้ง") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('blight').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_sheath_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const stalk_select = async => {
      let stalk_symptom = req.body.queryResult.parameters.Stalk_symptom;
      if (stalk_symptom === "ลำต้นมีจุด") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('spot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['blcak']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['black']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['dark brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['dark brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นเน่า") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('rot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH[0]}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH[0]}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH[1]}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH[1]}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": stalk_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH[2]}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH[2]}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นเหี่ยวแห้ง") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('blight').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": stalk_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นมีแผล") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('lesion').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": stalk_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "กลวงเป็นโพรง") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('hollow').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": stalk_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const leaf_select = async => {
      let leaf_symptom = req.body.queryResult.parameters.Leaf_symptom;
      if (leaf_symptom === "ใบไหม้") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('burn').get().then(doc => {
          let carouselMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (leaf_symptom === "ใบมีฝุ่นขาว") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('powder').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบมีปม") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('gall').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('yellow').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบแห้ง") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('blight').get().then(doc => {
          let carouselMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[0]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[1]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[2]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[3]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[3]}`
                        }
                      }
                    ]
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": leaf_symptom,
                        "align": "center"
                      },
                      {
                        "type": "image",
                        "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "description",
                        "align": "center"
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรูปเพิ่มเติม",
                          "text": `${doc.data().diseaseNameTH[4]}`
                        }
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "ดูรายละเอียด",
                          "text": `${doc.data().diseaseNameTH[4]}`
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", carouselMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (leaf_symptom === "ใบมีจุด") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('spot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['pale']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['pale']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['swell']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['white']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['white']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['yellow']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['yellow']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบมีแผลตามทางยาว") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('spot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['brown']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['gray']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['light green']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['light green']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['straw']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['white']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['white']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['yellow']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['yellow']}`
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": leaf_symptom,
                          "align": "center"
                        },
                        {
                          "type": "image",
                          "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "description",
                          "align": "center"
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรูปเพิ่มเติม",
                            "text": `${doc.data().diseaseNameTH['layer']}`
                          }
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "ดูรายละเอียด",
                            "text": `${doc.data().diseaseNameTH['layer']}`
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบมีแผลฉ่ำน้ำ") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('water-soaked').get()
          .then(doc => {
            let flexMsg = {
              "type": "flex",
              "altText": "Flex Message",
              "contents": {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": leaf_symptom,
                      "align": "center"
                    },
                    {
                      "type": "image",
                      "url": "https://developers.line.biz/assets/images/services/bot-designer-icon.png"
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Body",
                      "align": "center"
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ดูรายละเอียด",
                        "text": `${doc.data().diseaseNameTH}`
                      }
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", flexMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const disease_card = async => {
      const d_name = req.body.queryResult.parameters.disease;
      return queryDisease = db.collection('Disease').where('diseaseNameTH', '==', d_name).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var data = doc.data()
          //agent.add(dataa.symptom)
          let buttonMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": `${data.diseaseNameTH}`,
                    "align": "center"
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "image",
                    "url": `${data.url}`,
                    "size": "full"
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "สาเหตุ",
                      "text": `${data.forTemplate[0]}`
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "อาการ",
                      "text": `${data.forTemplate[1]}`
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "วิธีรักษา",
                      "text": `${data.forTemplate[2]}`
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "การป้องกัน",
                      "text": `${data.forTemplate[3]}`
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
        });
      });
    }

    const disease_cause = async => {
      const d_name = req.body.queryResult.parameters.disease;
      //const d_cause = req.body.queryResult.parameters.disease_cause;
      return queryCause = db.collection('Disease').where('diseaseNameTH', '==', d_name).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().cause)
        });
      });
    }

    const disease_symptom = async => {
      const d_name = req.body.queryResult.parameters.disease;
      //const d_symptom = req.body.queryResult.parameters.disease_cause;
      return querySymptom = db.collection('Disease').where('diseaseNameTH', '==', d_name).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().symptom)
        });
      });
    }

    const disease_treatment = async => {
      const d_name = req.body.queryResult.parameters.disease;
      //const d_treatment = req.body.queryResult.parameters.disease_cause;
      return queryTreatment = db.collection('Disease').where('diseaseNameTH', '==', d_name).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().treatment)
        });
      });
    }

    const disease_protection = async => {
      const d_name = req.body.queryResult.parameters.disease;
      //const d_protection = req.body.queryResult.parameters.disease_cause;
      return queryProtection = db.collection('Disease').where('diseaseNameTH', '==', d_name).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().protection)
        });
      });
    }



    let intentMap = new Map();
    // knowledge
    intentMap.set("Knowledge", knowledge);
    intentMap.set('Knowledge - Select', knowledge_select);

    // Disease
    intentMap.set('Disease', disease);

    // Disease Carousel
    intentMap.set('Disease Carousel', disease_carousel);
    intentMap.set('Disease Carousel - Select', disease_select);

    // Disease Imagemap
    intentMap.set('Disease Imagemap', disease_imagemap);
    intentMap.set('Disease Imagemap - Select Part', disease_imagemap_part);
    intentMap.set('Ear - Select Symptom', ear_select);
    intentMap.set('Basal - Select Symptom', basal_select);
    intentMap.set('Leaf-Sheath - Select Symptom', leaf_sheath_select);
    intentMap.set('Stalk - Select Symptom', stalk_select);
    intentMap.set('Leaf - Select Symptom', leaf_select);

    // Disease Leaf-Spot
    //intentMap.set('Leaf - Spot', leaf_spot);

    // Disease Card
    intentMap.set('Disease card', disease_card);
    intentMap.set('Disease card - cause', disease_cause);
    intentMap.set('Disease card - symptom', disease_symptom);
    intentMap.set('Disease card - treatment', disease_treatment);
    intentMap.set('Disease card - protection', disease_protection);

    // Addition disease
    //intentMap.set('Basal - Water-soaked', basal_ws);

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
