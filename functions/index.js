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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/DownyMildew%2Fleaf_downy15sq.jpg?alt=media&token=32eef626-b075-4805-a981-580e8b0377c8#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/CommonSmut%2Fear_commonSmut5sq.jpg?alt=media&token=f9b91008-7b2a-4b2b-89f7-76a90c9c6e26#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%20SouthernCornLeafBlight%2Fleaf_sblight6.jpg?alt=media&token=f8df6c5a-3cca-49e9-b583-22a4091ca22c#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/SouthernCornRust%2Fleaf_rust13sq.jpg?alt=media&token=ca83ef5e-f131-4629-8682-173319978149#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/NorthenCornLeafBlight%2Fleaf_nblight6.jpg?alt=media&token=0bdd7c39-c984-445e-bd50-7b124120489a#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/BandedLeafAndSheathBlight%2Frhizoctonia15.jpg?alt=media&token=8afb5714-967a-4ca4-908c-e287a8f3b921#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/whtieBG.jpg?alt=media&token=9b73336d-f0ac-4370-91d2-038a953f20f6",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/LeafSpot%2Fcurvularia18sq.jpg?alt=media&token=f8c15411-135d-4865-85e6-e1975f7a82a9#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/BacterialStalkRot%2Fstalk_bacterial15.jpg?alt=media&token=4386b918-d134-418c-85e9-355ca23daa7a#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%20FusariumStalkRot%2Fstalk_fasarium9sq.jpg?alt=media&token=7462e351-7169-4516-bfa3-409ddd859bc9#?width=auto%22",
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
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/%20CharcoalRot%2Fstalk_charcoal11.jpg?alt=media&token=e49bf671-c77b-405d-a61a-8fce38f72e8e#?width=auto%22",
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
            },
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/DiplodiaStalkKernelAndEarRot%2Fear_diplodia13.jpg?alt=media&token=ddd1ab6f-3454-4814-a368-18d162a9ebd5#?width=auto%22",
              "title": "โรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย",
              "text": "โรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย"
                }
              ]
            }
            ,
            {
              "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/PenicilliumKernelAndEarRot%2Fpenicillium4.jpg?alt=media&token=f5fcad26-b798-4e11-b6d1-0436ea6f6d33#?width=auto%22",
              "title": "โรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม",
              "text": "โรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม",
              "actions": [
                {
                  "type": "message",
                  "label": "สาเหตุ",
                  "text": "สาเหตุของโรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม"
                },
                {
                  "type": "message",
                  "label": "อาการ",
                  "text": "อาการของโรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม"
                },
                {
                  "type": "message",
                  "label": "การป้องกัน",
                  "text": "การป้องกันโรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม"
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

    // ส่วนdisease text ให้ผู้ใช้พิมพ์อาการของข้าวโพด ------ [2.2]
    const disease_text = async => {
      let full_symptom = req.body.queryResult.parameters.fullDiseaseText;
      const diseases = new Array();
      //return agent.add(queryDiseaseText(full_symptom))
      return queryCause = db.collection('Disease').where('query', 'array-contains-any', full_symptom).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          diseases.push(doc.data().diseaseNameTH)
          return agent.add(doc.data().diseaseNameTH);
          /*if (diseases.length == 1) {
            let buttonMsg = {
              "type": "template",
              "altText": `${doc.data().diseaseNameTH}`,
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
                "text": `${doc.data().diseaseNameTH}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          }
          else {
            return agent.add(doc.data().diseaseNameTH);
          }*/

          /*else if (diseases.length == 2){
            let carouselMsg = {
              "type": "template",
              "altText": "ค้นหาอาการ",
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url}`,
                    "title": `${doc.data().diseaseNameTH}`,
                    "text": `${doc.data().diseaseNameTH}`,
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
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url}`,
                    "title": `${doc.data().diseaseNameTH}`,
                    "text": `${doc.data().diseaseNameTH}`,
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
          else if (diseases.length >= 3){
            let carouselMsg = {
              "type": "template",
              "altText": "ค้นหาอาการ",
              "template": {
                "type": "carousel",
                "actions": [],
                "columns": [
                  {
                    "thumbnailImageUrl": `${doc.data().url}`,
                    "title": `${doc.data().diseaseNameTH}`,
                    "text": `${doc.data().diseaseNameTH}`,
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
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url}`,
                    "title": `${doc.data().diseaseNameTH}`,
                    "text": `${doc.data().diseaseNameTH}`,
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
                    ]
                  },
                  {
                    "thumbnailImageUrl": `${doc.data().url}`,
                    "title": `${doc.data().diseaseNameTH}`,
                    "text": `${doc.data().diseaseNameTH}`,
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
                    ]
                  }
                ]
              }
            }
            const payloadMsg = new Payload("LINE", carouselMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          }*/
        });
        //return agent.add(diseases[1])
        /*let buttonMsg = queryDiseaseText(diseases)
        const payloadMsg = new Payload("LINE", buttonMsg, {
          sendAsMessage: true
        });
        return agent.add(payloadMsg);*/

        return agent.add("สามารถดูรายละเอียดเพิ่มเติมแต่ละโรคได้ที่เมนู โรคพืช > แสดงโรคทั้งหมด ค่ะ");
      });

    }
    /*function queryDiseaseText(all_symptom) {
      let full_symptom = req.body.queryResult.parameters.fullDiseaseText;
      const diseases = new Array();
      //return agent.add(queryDiseaseText(full_symptom))
      return queryCause = db.collection('Disease').where('query', 'array-contains-any', full_symptom).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          diseases.push(doc.data().diseaseNameTH)
        });
        return diseases
      });
    }*/

    // ส่วน function disease_imagemap ให้ผู้ใช้กดเลือกอาการจากแผนภาพเพื่อหาโรคที่เข้าข่าย ------ [2.3]
    const disease_imagemap = async => {
      const imagemapMsg = {
        "type": "imagemap",
        "baseUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/imagemap.png?alt=media&token=417c6f0f-ab74-41a6-b8c6-857fa2551eea#?width=auto",
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
                        "label": "แผลฉ่ำน้ำ",
                        "text": "ใบมีแผลฉ่ำน้ำ"
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
                    "text": `${doc.data().description['brown']}`,
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
                    "text": `${doc.data().description['swell']}`,
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
                "text": `${doc.data().description}`
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
              "text": `${doc.data().description}`
            }
          }
          const payloadMsg = new Payload("LINE", buttonMsg, {
            sendAsMessage: true
          });
          return agent.add(payloadMsg);
        });
      }
      else if (ear_symptom === "ฝักมีราเขียว") {
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                    "text": `${doc.data().description['dark brown']}`,
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
                    "text": `${doc.data().description['grayish green']}`,
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
                    "text": `${doc.data().description['reddish brown']}`,
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (basal_symptom === "โคนต้นมีราขาว") {
        return db.collection('Symptom_disease').doc('Basal').collection('symptom').doc('fungus').get()
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description['swell']}`
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
                "text": `${doc.data().description['straw']}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const kernel_select = async => {
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
                "text": `${doc.data().description}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (kernel_symptom === "เมล็ดมีแผล") {
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
              "text": `${doc.data().description}`
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
                  "text": `${doc.data().description[0]}`,
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
                  "text": `${doc.data().description[1]}`,
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
              "text": `${doc.data().description}`
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
                  "text": `${doc.data().description[0]}`,
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
                  "text": `${doc.data().description[1]}`,
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
                "text": `${doc.data().description}`
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
                    "text": `${doc.data().description[0]}`,
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
                    "text": `${doc.data().description[1]}`,
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
                    "text": `${doc.data().description[2]}`,
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                    "text": `${doc.data().description[0]}`,
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
                    "text": `${doc.data().description[1]}`,
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
                    "text": `${doc.data().description[0]}`,
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
                    "text": `${doc.data().description[1]}`,
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
                    "text": `${doc.data().description[2]}`,
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
      else if (stalk_symptom === "ลำต้นแตก") {
        return db.collection('Symptom_disease').doc('Stalk').collection('symptom').doc('shred').get()
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
                "text": `${doc.data().description}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
    }

    const leaf_select = async => {
      let leaf_symptom = req.body.queryResult.parameters.Leaf_symptom;
      if (leaf_symptom === "ใบไหม้") {
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
                  "text": `${doc.data().description[0]}`,
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
                  "text": `${doc.data().description[1]}`,
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
                  "text": `${doc.data().description[2]}`,
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
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
                "text": `${doc.data().description}`
              }
            }
            const payloadMsg = new Payload("LINE", buttonMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
      }
      else if (leaf_symptom === "ใบแห้ง") {
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
                  "text": `${doc.data().description[0]}`,
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
                  "text": `${doc.data().description[1]}`,
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
                  "text": `${doc.data().description[2]}`,
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
                  "text": `${doc.data().description[4]}`,
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
                    "text": `${doc.data().description['brown']}`,
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
                    "text": `${doc.data().description['gray']}`,
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
                    "text": `${doc.data().description['pale']}`,
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
                    "text": `${doc.data().description['white']}`,
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
                    "text": `${doc.data().description['yellow']}`,
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
                    "text": `${doc.data().description['swell']}`,
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
                    "text": `${doc.data().description['brown']}`,
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
                    "text": `${doc.data().description['gray']}`,
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
                    "text": `${doc.data().description['gray2']}`,
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
                    "text": `${doc.data().description['gray3']}`,
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
                    "text": `${doc.data().description['layer']}`,
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
                    "text": `${doc.data().description['yellow']}`,
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
                    "text": `${doc.data().description['light green']}`,
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
                    "text": `${doc.data().description['straw']}`,
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
                "text": `${doc.data().description}`
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
              "hero": {
                "type": "image",
                "url": `${data.url}`,
                "size": "full",
                "aspectRatio": "1.51:1",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
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
                        "type": "separator"
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "message",
                          "label": "วิธีรักษา",
                          "text": `${data.forTemplate[2]}`
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
                          "label": "อาการ",
                          "text": `${data.forTemplate[1]}`
                        }
                      },
                      {
                        "type": "separator"
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
                ]
              }
            }
          }
          /*{
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "bubble",
              "direction": "ltr",
              "hero": {
                "type": "image",
                "url": `${data.url}`,
                "size": "full",
                "aspectRatio": "1.51:1",
                "aspectMode": "cover"
              },
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
                ]
              }
            }
          }*/
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
