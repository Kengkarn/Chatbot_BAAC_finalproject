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
      return agent.add("ต้องการทราบข้อมูลโรคข้าวโพดด้วยวิธีไหนคะ?"), agent.add(payloadMsg);
    }

    // ส่วนdisease text ให้ผู้ใช้พิมพ์อาการของข้าวโพด ------ [2.1]
    const disease_text = async => {
      let full_symptom = req.body.queryResult.parameters.fullDiseaseText;
      return queryCause = db.collection('Disease').where('query', 'array-contains-any', full_symptom).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().diseaseNameTH)
        });
      });
    }

    // ส่วน function disease_carousel แสดงโรคทั้งหมดที่มีในระบบ ------ [2.2]
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%A3%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%87%2F%E0%B8%A3%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%87.jpg?alt=media&token=aeaf06d2-a701-494a-ad5f-bcb17ec2dc18#?width=auto%22",
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
                  "text": "อาการของโรคราน้ำค้าง"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคราน้ำค้าง"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%97%2FcommonSmut.jpg?alt=media&token=c2e53e57-234b-4805-b653-ba560ab62f82#?width=auto%22",
              "title": "โรคสมัท หรือ ราเขม่าสีดำ",
              "text": "โรคสมัท หรือ ราเขม่าสีดำ (Common Smut)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคสมัท"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคสมัท"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคสมัท"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B9%83%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%A1%E0%B9%89%E0%B9%81%E0%B8%9C%E0%B8%A5%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81%2Flek3.jpg?alt=media&token=0f1f6621-7ba1-462a-b69f-81bd23f650f6",
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
                  "text": "อาการของโรคใบไหม้แผลเล็ก"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคใบไหม้แผลเล็ก"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%99%E0%B8%B4%E0%B8%A1%2F%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%99%E0%B8%B4%E0%B8%A1.jpg?alt=media&token=26f8e007-0e9e-4953-bd54-f2a322824fb0#?width=auto%22",
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
                  "text": "อาการของโรคราสนิม"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคราสนิม"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B9%83%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%A1%E0%B9%89%E0%B9%81%E0%B8%9C%E0%B8%A5%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%2Fyai1.jpg?alt=media&token=6bb92208-6251-4f5e-9f94-116b08f7feab",
              "title": "โรคใบไหม้แผลใหญ่",
              "text": "โรคใบไหม้แผลใหญ่ (Northen Corn Leaf Blight)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคใบไหม้แผลใหญ่"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคใบไหม้แผลใหญ่"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคใบไหม้แผลใหญ่"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/5be55-white-mk630n.jpg?alt=media&token=8cb8c86e-1a11-436d-9335-5e0c061868c0",
              "title": "  ",
              "text": "  ",
              "actions": [
                {
                  "type": "message",
                  "label": "ดูโรคเพิ่มเติม",
                  "text": "ดูโรคเพิ่มเติม"
                },
                {
                  "type": "message",
                  "label": "  ",
                  "text": "ดูโรคเพิ่มเติม"
                },
                {
                  "type": "message",
                  "label": "  ",
                  "text": "ดูโรคเพิ่มเติม"
                }
              ]
            }
          ]
        }
      }
      const payloadMsg = new Payload("LINE", carouselMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
    }

    const disease_carousel_more = async => {
      const carouselMsg = {
        "type": "template",
        "altText": "เลือกโรคข้าวโพด",
        "template": {
          "type": "carousel",
          "actions": [],
          "columns": [
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%81%E0%B8%B2%E0%B8%9A%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%83%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%A1%E0%B9%89%2F%E0%B8%81%E0%B8%B2%E0%B8%9A%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%83%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%A1%E0%B9%893.jpg?alt=media&token=955b6331-38b9-4605-9ea8-c8cea455fa70#?width=auto%22",
              "title": "โรคกาบและใบไหม้",
              "text": "โรคกาบและใบไหม้ (Banded Leaf and Sheath Blight)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคกาบและใบไหม้"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคกาบและใบไหม้"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคกาบและใบไหม้"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B9%83%E0%B8%9A%E0%B8%88%E0%B8%B8%E0%B8%94%2Fspot3.jpg?alt=media&token=643b14b5-cda7-4788-910a-f01977d10823",
              "title": "โรคใบจุด",
              "text": "โรคใบจุด (Leaf Spot)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคใบจุด"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคใบจุด"
                },
                {

                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคใบจุด"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%95%E0%B9%89%E0%B8%99%E0%B9%80%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%84%E0%B8%97%E0%B8%B5%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%2F%E0%B9%81%E0%B8%9A%E0%B8%84%E0%B8%97%E0%B8%B5%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2.jpg?alt=media&token=e0cc0bce-9c09-408a-b85c-147eb7c9959a#?width=auto%22",
              "title": "โรคต้นเน่าจากเชื้อแบคทีเรีย",
              "text": "โรคต้นเน่าจากเชื้อแบคทีเรีย (Bacterial Stalk Rot)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคต้นเน่าจากเชื้อแบคทีเรีย"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคต้นเน่าจากเชื้อแบคทีเรีย"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคต้นเน่าจากเชื้อแบคทีเรีย"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%94%E0%B8%B4%E0%B9%82%E0%B8%9E%E0%B8%A5%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%2Fdiplo.jpg?alt=media&token=09e1c84c-70b6-4e64-8b40-e16894972b7c",
              "title": "โรคต้นเน่าจากเชื้อฟิวซาเรี่ยม",
              "text": "โรคต้นเน่าจากเชื้อฟิวซาเรี่ยม (Fusarium Stalk Rot)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคต้นเน่าจากเชื้อฟิวซาเรี่ยม"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคต้นเน่าจากเชื้อฟิวซาเรี่ยม"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคต้นเน่าจากเชื้อฟิวซาเรี่ยม"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%E0%B8%A1%E0%B8%B2%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B9%82%E0%B8%9F%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B9%88%E0%B8%B2%2Fcha2.jfif?alt=media&token=220dd421-1c50-4a39-bc41-4e1b9d732a4d",
              "title": "โรคต้นเน่าจากเชื้อมาโครโฟมิน่า",
              "text": "โรคต้นเน่าจากเชื้อมาโครโฟมิน่า (Charcoal Rot)",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคต้นเน่าจากเชื้อมาโครโฟมิน่า"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคต้นเน่าจากเชื้อมาโครโฟมิน่า"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคต้นเน่าจากเชื้อมาโครโฟมิน่า"
                }
              ]
            }
          ]
        }
      }
      const payloadMsg = new Payload("LINE", carouselMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
    }

    // แสดงรายละเอียดของโรคแต่ละหัวข้อที่ผู้ใช้เลือก
    const carousel_cause = async => {
      let c_cause = req.body.queryResult.parameters.carouselcause;
      //return agent.add(d_cause);
      return queryCause = db.collection('Disease').where('forTemplate', 'array-contains', c_cause).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().cause)
        });
      });
    }
    const carousel_symptom = async => {
      let c_symptom = req.body.queryResult.parameters.carouselsymptom;
      //return agent.add(d_cause);
      return queryCause = db.collection('Disease').where('forTemplate', 'array-contains', c_symptom).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().symptom)
        });
      });
    }
    const carousel_protection = async => {
      let c_protection = req.body.queryResult.parameters.carouselprotection;
      //return agent.add(d_cause);
      return queryCause = db.collection('Disease').where('forTemplate', 'array-contains', c_protection).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          agent.add(doc.data().protection)
        });
      });
    }
    /*const disease_select = async => {
      let disease_s = req.body.queryResult.parameters.disease_select;
      if (disease_s === "การป้องกันโรคราน้ำค้าง") {
        return db.collection('Disease').doc('DownyMildew').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "การป้องกันโรคใบไหม้แผลเล็ก") {
        return db.collection('Disease').doc('SouthernCornLeafBlight').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
      else if (disease_s === "การป้องกันโรคราสนิม") {
        return db.collection('Disease').doc('SouthernCornRust').get().then(doc => {
          agent.add(doc.data().protection);
        });
      }
    }*/


    // ส่วน function disease_imagemap ให้ผู้ใช้กดเลือกอาการจากแผนภาพเพื่อหาโรคที่เข้าข่าย ------ [2.3]
    const disease_imagemap = async => {
      const imagemapMsg = {
        "type": "imagemap",
        "baseUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/106.png?alt=media&token=36f9c308-c59d-4595-9568-ddc09e71e8d7#?width=auto",
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
            "text": "เมล็ด"
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
      return agent.add("เกิดโรคที่ส่วนไหนของข้าวโพดคะ?"), agent.add(payloadMsg);
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
                        "label": "มีราเขียว",
                        "text": "ฝักมีราเขียว"
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
                        "label": "มีราขาว",
                        "text": "โคนต้นมีราขาว"
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

      else if (disease_part === "เมล็ด") {
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
                        "label": "เมล็ดมีรอยขีดสีขาว",
                        "text": "เมล็ดมีรอยขีดสีขาว"
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
                        "label": "มีแผล",
                        "text": "เมล็ดมีแผล"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เมล็ดดำ",
                        "text": "เมล็ดดำ"
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
                        "label": "ไม่มีเมล็ด",
                        "text": "ไม่มีเมล็ด"
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
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "เมล็ดลีบ",
                        "text": "เมล็ดลีบ"
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
        return agent.add("เลือกอาการที่เกิดที่ฝัก"), agent.add(payloadMsg);
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
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ลำต้นแตก/ฉีก",
                        "text": "ลำต้นแตก"
                      }
                    },
                    {
                      "type": "separator"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "หักล้ม",
                        "text": "ลำต้นหักล้ม"
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
            let carouselMsg = {
              "type": "template",
              "altText": "เลือกประเภทข้าวโพด",
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url['brown']}`,
                    "title": `${doc.data().diseaseNameTH['brown']}`,
                    "text": ear_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['brown']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['brown']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['swell']}`,
                    "title": `${doc.data().diseaseNameTH['swell']}`,
                    "text": ear_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['swell']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['swell']}`
                      }
                    ]
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
            let buttonMsg = {
              "type": "template",
              "altText": ear_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": ear_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('yellow').get().then(doc => {
          let buttonMsg = {
            "type": "template",
            "altText": ear_symptom,
            "template": {
              "type": "buttons",
              "actions": [
                {
                  "type": "message",
                  "label": "ดูรูปเพิ่มเติม",
                  "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                },
                {
                  "type": "message",
                  "label": "อ่านรายละเอียด",
                  "text": `${doc.data().diseaseNameTH[0]}`
                }
              ],
              "thumbnailImageUrl": `${doc.data().url}`,
              "title": `${doc.data().diseaseNameTH[0]}`,
              "text": ear_symptom
            }
          }
          const payloadMsg = new Payload("LINE", buttonMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (ear_symptom === "ฝักมีราขาว") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('fungus').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": ear_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": ear_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักเน่า") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('rot').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": ear_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": ear_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (ear_symptom === "ฝักมีปม") {
        return db.collection('Symptom_disease').doc('Ear').collection('symptom').doc('gall').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": ear_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": ear_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
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
            let buttonMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นมีแผลช้ำ") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('water-soaked').get()
          .then(doc => {
            let carouselMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url['dark brown']}`,
                    "title": `${doc.data().diseaseNameTH['dark brown']}`,
                    "text": basal_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['dark brown']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['dark brown']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['grayish green']}`,
                    "title": `${doc.data().diseaseNameTH['grayish green']}`,
                    "text": basal_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['grayish green']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['grayish green']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['reddish brown']}`,
                    "title": `${doc.data().diseaseNameTH['reddish brown']}`,
                    "text": basal_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['reddish brown']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['reddish brown']}`
                      }
                    ]
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
      else if (basal_symptom === "โคนต้นมีน้ำเมือก") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('slime').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนหักล้ม") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('fall-over').get()
          .then(doc => {
            let flexMsg = {
              "type": "template",
              "altText": "this is a buttons template",
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
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
            let buttonMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('yellow').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นมีราขาว") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('smell').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": basal_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": basal_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }


    const leaf_sheath_select = async => {
      let leaf_sheath_symptom = req.body.queryResult.parameters.Leaf_sheath_symptom;
      if (leaf_sheath_symptom === "กาบใบมีจุด") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('spot').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_sheath_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['swell']}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH['swell']}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url['swell']}`,
                "title": `${doc.data().diseaseNameTH['swell']}`,
                "text": leaf_sheath_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบมีแผล") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('lesion').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_sheath_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['straw']}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH['straw']}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url['straw']}`,
                "title": `${doc.data().diseaseNameTH['straw']}`,
                "text": leaf_sheath_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบซีดเหลือง") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('yellow').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_sheath_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_sheath_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_sheath_symptom === "กาบใบแห้ง") {
        return db.collection('Symptom_disease').doc('LeafSheath').collection('symptom').doc('blight').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_sheath_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_sheath_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const kernel_select = async =>{
      let kernel_symptom = req.body.queryResult.parameters.Kernel_symptom;
      if (kernel_symptom === "เมล็ดมีรอยขีดสีขาว") {
        return db.collection('Symptom_disease').doc('Kernel').collection('symptom').doc('scratch').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": kernel_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": kernel_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (kernel_symptom === "เมล็ดมีแผล"){
        return db.collection('Symptom_disease').doc('Kernel').collection('symptom').doc('lesion').get().then(doc => {
          let buttonMsg = {
            "type": "template",
            "altText": kernel_symptom,
            "template": {
              "type": "buttons",
              "actions": [
                {
                  "type": "message",
                  "label": "ดูรูปเพิ่มเติม",
                  "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                },
                {
                  "type": "message",
                  "label": "อ่านรายละเอียด",
                  "text": `${doc.data().diseaseNameTH}`
                }
              ],
              "thumbnailImageUrl": `${doc.data().url}`,
              "title": `${doc.data().diseaseNameTH}`,
              "text": kernel_symptom
            }
          }
          const payloadMsg = new Payload("LINE", buttonMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (kernel_symptom === "เมล็ดดำ") {
        return db.collection('Symptom_disease').doc('Kernel').collection('symptom').doc('black').get().then(doc => {
          let carouselMsg = {
            "type": "template",
            "altText": kernel_symptom,
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${doc.data().url[0]}`,
                  "title": `${doc.data().diseaseNameTH[0]}`,
                  "text": kernel_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[0]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[1]}`,
                  "title": `${doc.data().diseaseNameTH[1]}`,
                  "text": kernel_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[1]}`
                    }
                  ]
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
      else if (kernel_symptom === "ไม่มีเมล็ด" || kernel_symptom === "เมล็ดน้อย") {
        return db.collection('Symptom_disease').doc('Kernel').collection('symptom').doc('stunt').get().then(doc => {
          let buttonMsg = {
            "type": "template",
            "altText": kernel_symptom,
            "template": {
              "type": "buttons",
              "actions": [
                {
                  "type": "message",
                  "label": "ดูรูปเพิ่มเติม",
                  "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                },
                {
                  "type": "message",
                  "label": "อ่านรายละเอียด",
                  "text": `${doc.data().diseaseNameTH}`
                }
              ],
              "thumbnailImageUrl": `${doc.data().url}`,
              "title": `${doc.data().diseaseNameTH}`,
              "text": kernel_symptom
            }
          }
          const payloadMsg = new Payload("LINE", buttonMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (kernel_symptom === "เมล็ดลีบ") {
        return db.collection('Symptom_disease').doc('Kernel').collection('symptom').doc('lean').get().then(doc => {
          let carouselMsg = {
            "type": "template",
            "altText": kernel_symptom,
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${doc.data().url[0]}`,
                  "title": `${doc.data().diseaseNameTH[0]}`,
                  "text": kernel_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[0]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[1]}`,
                  "title": `${doc.data().diseaseNameTH[1]}`,
                  "text": kernel_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[1]}`
                    }
                  ]
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

    const stalk_select = async => {
      let stalk_symptom = req.body.queryResult.parameters.Stalk_symptom;
      if (stalk_symptom === "ลำต้นมีจุด") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('spot').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": stalk_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นเน่า") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('rot').get()
          .then(doc => {
            let carouselMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url[0]}`,
                    "title": `${doc.data().diseaseNameTH[0]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[0]}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url[1]}`,
                    "title": `${doc.data().diseaseNameTH[1]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[1]}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url[2]}`,
                    "title": `${doc.data().diseaseNameTH[2]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[2]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[2]}`
                      }
                    ]
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
            let buttonMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": stalk_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นมีแผล") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('lesion').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": stalk_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "กลวงเป็นโพรง") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('hollow').get()
          .then(doc => {
            let carouselMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url[0]}`,
                    "title": `${doc.data().diseaseNameTH[0]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[0]}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url[1]}`,
                    "title": `${doc.data().diseaseNameTH[1]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[1]}`
                      }
                    ]
                  },
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (stalk_symptom === "ลำต้นหักล้ม") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('fall over').get()
          .then(doc => {
            let carouselMsg = {
              "type": "template",
              "altText": stalk_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url[0]}`,
                    "title": `${doc.data().diseaseNameTH[0]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[0]}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url[1]}`,
                    "title": `${doc.data().diseaseNameTH[1]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[1]}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url[2]}`,
                    "title": `${doc.data().diseaseNameTH[2]}`,
                    "text": stalk_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[2]}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH[2]}`
                      }
                    ]
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

    const leaf_select = async => {
      let leaf_symptom = req.body.queryResult.parameters.Leaf_symptom;
      if (leaf_symptom === "ใบไหม้") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('burn').get().then(doc => {
          let carouselMsg = {
            "type": "template",
            "altText": leaf_symptom,
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${doc.data().url[0]}`,
                  "title": `${doc.data().diseaseNameTH[0]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[0]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[1]}`,
                  "title": `${doc.data().diseaseNameTH[1]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[1]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[2]}`,
                  "title": `${doc.data().diseaseNameTH[2]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[2]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[2]}`
                    }
                  ]
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
            let buttonMsg = {
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบมีปม") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('gall').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบซีดเหลือง") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('yellow').get()
          .then(doc => {
            let buttonMsg = {
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบแห้ง") {
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('blight').get().then(doc => {
          let carouselMsg = {
            "type": "template",
            "altText": leaf_symptom,
            "template": {
              "type": "carousel",
              "actions": [],
              "columns": [
                {
                  "thumbnailImageUrl": `${doc.data().url[0]}`,
                  "title": `${doc.data().diseaseNameTH[0]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[0]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[0]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[1]}`,
                  "title": `${doc.data().diseaseNameTH[1]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[1]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[1]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[2]}`,
                  "title": `${doc.data().diseaseNameTH[2]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[2]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[2]}`
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": `${doc.data().url[4]}`,
                  "title": `${doc.data().diseaseNameTH[4]}`,
                  "text": leaf_symptom,
                  "actions": [
                    {
                      "type": "message",
                      "label": "ดูรูปเพิ่มเติม",
                      "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH[4]}`
                    },
                    {
                      "type": "message",
                      "label": "อ่านรายละเอียด",
                      "text": `${doc.data().diseaseNameTH[4]}`
                    }
                  ]
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
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url['brown']}`,
                    "title": `${doc.data().diseaseNameTH['brown']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['brown']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['brown']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['gray']}`,
                    "title": `${doc.data().diseaseNameTH['gray']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['gray']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['gray']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['pale']}`,
                    "title": `${doc.data().diseaseNameTH['pale']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['pale']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['pale']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['white']}`,
                    "title": `${doc.data().diseaseNameTH['white']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['white']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['white']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['yellow']}`,
                    "title": `${doc.data().diseaseNameTH['yellow']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['yellow']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['yellow']}`
                      }
                    ]
                  }
                  ,
                  {
                    "thumbnailImageUrl": `${doc.data().url['swell']}`,
                    "title": `${doc.data().diseaseNameTH['swell']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['swell']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['swell']}`
                      }
                    ]
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
        return db.collection('Symptom_disease').doc('Leaf').collection('symptom').doc('lesion').get()
          .then(doc => {
            let carouselMsg = {
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url['brown']}`,
                    "title": `${doc.data().diseaseNameTH['brown']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['brown']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['brown']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['gray']}`,
                    "title": `${doc.data().diseaseNameTH['gray']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['gray']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['gray']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['gray2']}`,
                    "title": `${doc.data().diseaseNameTH['gray2']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['gray2']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['gray2']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['gray3']}`,
                    "title": `${doc.data().diseaseNameTH['gray3']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['gray3']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['gray3']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['layer']}`,
                    "title": `${doc.data().diseaseNameTH['layer']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['layer']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['layer']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['yellow']}`,
                    "title": `${doc.data().diseaseNameTH['yellow']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['yellow']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['yellow']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['light green']}`,
                    "title": `${doc.data().diseaseNameTH['light green']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['light green']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['light green']}`
                      }
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url['straw']}`,
                    "title": `${doc.data().diseaseNameTH['straw']}`,
                    "text": leaf_symptom,
                    "actions": [
                      {
                        "type": "message",
                        "label": "ดูรูปเพิ่มเติม",
                        "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH['straw']}`
                      },
                      {
                        "type": "message",
                        "label": "อ่านรายละเอียด",
                        "text": `${doc.data().diseaseNameTH['straw']}`
                      }
                    ]
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
            let buttonMsg = {
              "type": "template",
              "altText": leaf_symptom,
              "template": {
                "type": "buttons",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดูรูปเพิ่มเติม",
                    "text": "ดูรูปเพิ่มเติม" + `${doc.data().diseaseNameTH}`
                  },
                  {
                    "type": "message",
                    "label": "อ่านรายละเอียด",
                    "text": `${doc.data().diseaseNameTH}`
                  }
                ],
                "thumbnailImageUrl": `${doc.data().url}`,
                "title": `${doc.data().diseaseNameTH}`,
                "text": leaf_symptom
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
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

    const image_carousel = async => {
      const d_image = req.body.queryResult.parameters.moreimage;
      //const d_cause = req.body.queryResult.parameters.disease_cause;
      return queryCause = db.collection('Disease').where('forTemplate', 'array-contains', d_image).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var image = doc.data()
          let buttonMsg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": [
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "hero": {
                    "type": "image",
                    "url": `${image.image[0]}`,
                    "size": "full",
                    "aspectMode": "cover"
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "hero": {
                    "type": "image",
                    "url": `${image.image[1]}`,
                    "size": "full",
                    "aspectMode": "cover"
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "hero": {
                    "type": "image",
                    "url": `${image.image[2]}`,
                    "size": "full",
                    "aspectMode": "cover"
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "hero": {
                    "type": "image",
                    "url": `${image.image[3]}`,
                    "size": "full",
                    "aspectMode": "cover"
                  }
                },
                {
                  "type": "bubble",
                  "direction": "ltr",
                  "hero": {
                    "type": "image",
                    "url": `${image.image[4]}`,
                    "size": "full",
                    "aspectMode": "cover"
                  }
                }
              ]
            }
          }
          const payloadMsg = new Payload("LINE", buttonMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      });
    }


    let intentMap = new Map();
    // knowledge
    intentMap.set("Knowledge", knowledge);
    intentMap.set('Knowledge - Select', knowledge_select);

    // Disease
    intentMap.set('Disease', disease);

    // Disease Text
    intentMap.set('Type your corn symptoms', disease_text);

    // Disease Carousel
    intentMap.set('Disease Carousel', disease_carousel);
    intentMap.set('Carousel - cause', carousel_cause);
    intentMap.set('Carousel - symptom', carousel_symptom);
    intentMap.set('Carousel - protection', carousel_protection);
    intentMap.set('Carousel - more', disease_carousel_more);


    // Disease Imagemap
    intentMap.set('Disease Imagemap', disease_imagemap);
    intentMap.set('Disease Imagemap - Select Part', disease_imagemap_part);
    intentMap.set('Ear - Select Symptom', ear_select);
    intentMap.set('Basal - Select Symptom', basal_select);
    intentMap.set('Leaf-Sheath - Select Symptom', leaf_sheath_select);
    intentMap.set('Kernel - Select Symptom', kernel_select);
    intentMap.set('Stalk - Select Symptom', stalk_select);
    intentMap.set('Leaf - Select Symptom', leaf_select);

    // Disease Card -- See details
    intentMap.set('Disease card', disease_card);
    intentMap.set('Disease card - cause', disease_cause);
    intentMap.set('Disease card - symptom', disease_symptom);
    intentMap.set('Disease card - treatment', disease_treatment);
    intentMap.set('Disease card - protection', disease_protection);

    // Image Carousel -- See more picture
    intentMap.set('Image Carousel', image_carousel);

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
