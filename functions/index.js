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

const FieldValue = require('firebase-admin').firestore.FieldValue;

//ทำ webhook request url
exports.webhook = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    console.log("LINE REQUEST BODY", JSON.stringify(req.body));

    const agent = new WebhookClient({ request: req, response: res });

    let source = req.body.originalDetectIntentRequest.source;

    if (typeof source === "undefined") {
      source = "";
    }

    //ดึงข้อมูล userId
    let userId = "";
    if (source === "line") {
      userId =
        req.body.originalDetectIntentRequest.payload.data.source.userId;
      userText = req.body.originalDetectIntentRequest.payload.data.message.text;
    }



    const user_province = async agent => {
      let userProvince = req.body.queryResult.parameters.province;


      return db.collection("User_chatbot").doc(userId).get().then(returnData => {
        if (returnData.exists) {
          return agent.add("มีอะไรให้บอทช่วยคะ")
        }
        else {
          if (userProvince == 'เชียงใหม่' || userProvince == 'เชียงราย' ||
            userProvince == 'ลำปาง' || userProvince == 'ลำพูน' ||
            userProvince == 'แม่ฮ่องสอน' || userProvince == 'น่าน' ||
            userProvince == 'พะเยา' || userProvince == 'แพร่' ||
            userProvince == 'อุตรดิตถ์' || userProvince == 'ตาก' ||
            userProvince == 'สุโขทัย' || userProvince == 'พิษณุโลก' ||
            userProvince == 'พิจิตร' || userProvince == 'กำแพงเพชร' ||
            userProvince == 'นครสวรรค์' || userProvince == 'อุทัยธานี' ||
            userProvince == 'เพชรบูรณ์') {
            userRegion = "ภาคเหนือ"
          } else if (userProvince == 'อำนาจเจริญ' || userProvince == 'บึงกาฬ' ||
            userProvince == 'บุรีรัมย์' || userProvince == 'ชัยภูมิ' ||
            userProvince == 'กาฬสินธุ์' || userProvince == 'ขอนแก่น' ||
            userProvince == 'เลย' || userProvince == 'มหาสารคาม' ||
            userProvince == 'มุกดาหาร' || userProvince == 'นครพนม' ||
            userProvince == 'นครราชสีมา' || userProvince == 'หนองบัวลำภู' ||
            userProvince == 'หนองคาย' || userProvince == 'ร้อยเอ็ด' ||
            userProvince == 'สกลนคร' || userProvince == 'ศรีสะเกษ' ||
            userProvince == 'สุรินทร์' || userProvince == 'อุบลราชธานี' ||
            userProvince == 'อุดรธานี' || userProvince == 'ยโสธร') {
            userRegion = "ภาคตะวันออกเฉียงเหนือ"
          } else if (userProvince == 'อ่างทอง' || userProvince == 'ชัยนาท' ||
            userProvince == 'พระนครศรีอยุธยา' || userProvince == 'กรุงเทพมหานคร' ||
            userProvince == 'ลพบุรี' || userProvince == 'นครปฐม' ||
            userProvince == 'นนทบุรี' || userProvince == 'ปทุมธานี' ||
            userProvince == 'สมุทรปราการ' || userProvince == 'สมุทรสาคร' ||
            userProvince == 'สมุทรสงคราม' || userProvince == 'สระบุรี' ||
            userProvince == 'สิงห์บุรี' || userProvince == 'สุพรรณบุรี' ||
            userProvince == 'นครนายก' || userProvince == 'ฉะเชิงเทรา' ||
            userProvince == 'จันทบุรี' || userProvince == 'ชลบุรี' ||
            userProvince == 'ปราจีนบุรี' || userProvince == 'ระยอง' ||
            userProvince == 'สระแก้ว' || userProvince == 'ตราด' ||
            userProvince == 'กาญจนบุรี' || userProvince == 'ราชบุรี' ||
            userProvince == 'เพชรบุรี' || userProvince == 'ประจวบคีรีขันธ์'
          ) {
            userRegion = "ภาคกลาง"
          } else if (userProvince == 'นครศรีธรรมราช' || userProvince == 'นราธิวาส' ||
            userProvince == 'ชุมพร' || userProvince == 'ปัตตานี' ||
            userProvince == 'พัทลุง' || userProvince == 'สงขลา' ||
            userProvince == 'สุราษฎร์ธานี' || userProvince == 'ยะลา' ||
            userProvince == 'กระบี่' || userProvince == 'พังงา' ||
            userProvince == 'ภูเก็ต' || userProvince == 'ระนอง' ||
            userProvince == 'สตูล' || userProvince == 'ตรัง') {
            userRegion = "ภาคใต้"
          }
          return db.collection("User_chatbot").doc(userId).set({
            timestamp: currentDate,
            userId: userId,
            userProvince: userProvince,
            userRegion: userRegion,
            status: true
          })
        }
      })
    }
    const currentDate = Date.now();
    /*const user_province = async agent => {
      let userProvince = req.body.queryResult.parameters.province;
      return db.collection("User_chatbot").doc(userId).set({
        timestamp: currentDate,
        userId: userId,
        userProvince: userProvince,
        status: true
      })
    }*/

    const app_suggestion = async agent => {
      return db.collection('Application').get().then(doc => {
        const carouselMsg = {
          "type": "template",
          "altText": "this is a carousel template",
          "template": {
            "type": "carousel",
            "actions": [],
            "columns": [
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_4corn.jpg?alt=media&token=06c40288-bbe8-48e2-a2c5-5a5421df784d",
                "title": "4 Corn Production",
                "text": "แอปพลิเคชั่นที่บูรณาข้อมูลอุตุนิยมวิทยา แผนปลูกข้าวโพด ขั้นตอนต่างๆ",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=th.ac.ku.agr.maizeWela&hl=th"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/4-corn-production/id1333353844?fbclid=IwAR1Cv7cRTBH9NOZrskMDtId-Vaf2pjB0f7J15oQX1_jrtSkvkmm4_11lpzI"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_farmai.jpg?alt=media&token=7a2a7296-655c-4e26-9e1b-edb1c4442b52",
                "title": "FarmAI - ฟาร์มเอไอ",
                "text": "แอปพลิเคชั่นเพื่อการทำเกษตรกรอย่างแม่นยำและยั่งยืน เสหมือนมีพี่เลี้ยง",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=com.farmai"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/farmai/id1466037389?fbclid=IwAR0yWTgm_IU6fFjClytOtPPXMxWgq4D_HvZ2U15hRpjKrwAURqyG6g4Tuoo"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_talad.jpg?alt=media&token=99607869-50f4-4bce-ae3a-d5cc954697f3",
                "title": "TALAD ตลาด",
                "text": "แอปพลิเคชั่นเพื่อหาผู้รับจ้าง-จองคิวงานเกษตร เช่น ซ่อมรถ/เครื่องจักร",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=app.talad&hl=th"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/talad-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94/id1436394639"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_getztrac.jpg?alt=media&token=d7c0445f-284e-4f6d-b3cb-5132f307c9e5",
                "title": "Getztrac เก็ทแทรค",
                "text": "แอปพลิเคชันจ้างรถเกี่ยวข้าวและเครื่องจักรการเกษตรอื่นๆ",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=com.tomsuthee.getztrac&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/getztrac-%E0%B9%80%E0%B8%81-%E0%B8%97%E0%B9%81%E0%B8%97%E0%B8%A3%E0%B8%84/id1453958112"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_dtac%20farmer%20info.jpg?alt=media&token=53ebd49b-3c01-46ec-900a-b2836dab0b76",
                "title": "Farmer Info",
                "text": "แอปพลิเคชั่นสำหรับลูกค้า Dtac เป็นศูนย์รวมความรู้ด้านการเกษตรแบบครบวงจร",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=com.rakbankerd.farmerinfo&hl=en"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/farmer-info/id541507104?l=th"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_ac%20vocab.jpg?alt=media&token=55e3057c-9761-4393-9ff8-60ebc101f479",
                "title": "AC AGRI VOCAB",
                "text": "แอปพลิเคชั่นสำหรับเรียนรู้คำศัพท์พื้นฐานด้านการเกษตรใน 5 ภาษาอาเซียน",
                "actions": [
                  {
                    "type": "message",
                    "label": "ดาวน์โหลด (Andriod)",
                    "text": "ดาวน์โหลด AC AGRI VOCAB แอนดรอยด์"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/ac-agri-vocab/id1048524071"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2FOAE%20Reduce%20Cost.png?alt=media&token=59441855-eb5a-41e4-8fd7-b593f9e3c147",
                "title": "กระดานเศรษฐี:เกษตรกรมีโอกาส",
                "text": "แอปพลิเคชันเพื่อคำนวณต้นทุนและเปรียบเทียบต้นทุนการผลิตสินค้าเกษตร",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=th.go.oae.rcmo&hl=th"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%A8%E0%B8%A3%E0%B8%A9%E0%B8%90-%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%A1-%E0%B9%82%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%AA/id1138196348"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Application%2Fapp_MOAC.jpg?alt=media&token=52d32afa-1e4c-46da-a195-6f8867bd4b2d",
                "title": "MOAC App Center",
                "text": "เป็นศูนย์รวมแอพพลิเคชั่นเพื่อการเกษตรสำหรับเกษตรกรและผู้ที่สนใจ",
                "actions": [
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (Andriod)",
                    "uri": "https://play.google.com/store/apps/details?id=com.app.moac.appcenter&hl=en"
                  },
                  {
                    "type": "uri",
                    "label": "ดาวน์โหลด (ios)",
                    "uri": "https://apps.apple.com/th/app/moac-app-center/id1086873114?l=th"
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
      return queryCause = db.collection('Disease')
        .where('forTemplate', 'array-contains', c_cause)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().cause)
          });
        });
    }
    const carousel_symptom = async => {
      let c_symptom = req.body.queryResult.parameters.carouselsymptom;
      //return agent.add(d_cause);
      return queryCause = db.collection('Disease')
        .where('forTemplate', 'array-contains', c_symptom)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().symptom)
          });
        });
    }
    const carousel_protection = async => {
      let c_protection = req.body.queryResult.parameters.carouselprotection;
      //return agent.add(d_cause);
      return queryCause = db.collection('Disease')
        .where('forTemplate', 'array-contains', c_protection)
        .get().then(function (querySnapshot) {
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
      return queryCause = db.collection('Disease')
        .where('query', 'array-contains-any', full_symptom)
        .get().then(function (querySnapshot) {
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
      let disease_part = req.body.queryResult.parameters.part;
      let ear_symptom = req.body.queryResult.parameters.Ear_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          }).then(snapshot => {
            if (ear_symptom === "ฝักมีจุด") {
              db.collection("textQuery")
                .doc('ear_spot').update({
                  sum: FieldValue.increment(1)
                })
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
              db.collection("textQuery")
                .doc('ear_lesion').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Ear')
                .collection('symptom').doc('lesion').get()
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
              db.collection("textQuery")
                .doc('ear_yellow').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Ear')
                .collection('symptom').doc('yellow').get().then(doc => {
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
              db.collection("textQuery")
                .doc('ear_fungus').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Ear')
                .collection('symptom').doc('fungus').get()
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
              db.collection("textQuery")
                .doc('ear_rot').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Ear')
                .collection('symptom').doc('rot').get()
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
              db.collection("textQuery")
                .doc('ear_gall').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Ear')
                .collection('symptom').doc('gall').get()
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
          })
        }
      })
    }

    const basal_select = async => {
      let disease_part = req.body.queryResult.parameters.part;
      let basal_symptom = req.body.queryResult.parameters.Basal_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          }).then(snapshot => {
            db.collection("textQuery")
              .doc('basal_split').update({
                sum: FieldValue.increment(1)
              })
            if (basal_symptom === "โคนต้นแตก") {
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('split').get()
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
              db.collection("textQuery")
                .doc('basal_water-soaked').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('water-soaked').get()
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
              db.collection("textQuery")
                .doc('basal_slime').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('slime').get()
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
              db.collection("textQuery")
                .doc('basal_fall-over').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('fall-over').get()
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
              db.collection("textQuery")
                .doc('basal_smell').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('smell').get()
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
              db.collection("textQuery")
                .doc('basal_yellow').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('yellow').get()
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
              db.collection("textQuery")
                .doc('basal_fungus').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Basal')
                .collection('symptom').doc('fungus').get()
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
          });
        }
      })
    }


    const leaf_sheath_select = async => {
      let disease_part = req.body.queryResult.parameters.part;
      let leaf_sheath_symptom = req.body.queryResult.parameters.Leaf_sheath_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          }).then(snapshot => {
            if (leaf_sheath_symptom === "กาบใบมีจุด") {
              db.collection("textQuery")
                .doc('sheath_spot').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('LeafSheath')
                .collection('symptom').doc('spot').get()
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
              db.collection("textQuery")
                .doc('sheath_lesion').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('LeafSheath')
                .collection('symptom').doc('lesion').get()
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
              db.collection("textQuery")
                .doc('sheath_yellow').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('LeafSheath')
                .collection('symptom').doc('yellow').get()
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
              db.collection("textQuery")
                .doc('sheath_blight').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('LeafSheath')
                .collection('symptom').doc('blight').get()
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
          });
        }
      })
    }

    const kernel_select = async => {
      let disease_part = req.body.queryResult.parameters.part;
      let kernel_symptom = req.body.queryResult.parameters.Kernel_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          }).then(snapshot => {
            if (kernel_symptom === "เมล็ดมีรอยขีดสีขาว") {
              db.collection("textQuery")
                .doc('kernel_scratch').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Kernel')
                .collection('symptom').doc('scratch').get()
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
              db.collection("textQuery")
                .doc('kernel_lesion').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Kernel')
                .collection('symptom').doc('lesion').get().then(doc => {
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
              db.collection("textQuery")
                .doc('kernel_black').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Kernel')
                .collection('symptom').doc('black').get().then(doc => {
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
              db.collection("textQuery")
                .doc('kernel_stunt').update({
                  sum: FieldValue.increment(1)
                })
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
              db.collection("textQuery")
                .doc('kernel_lean').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Kernel')
                .collection('symptom').doc('lean').get().then(doc => {
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
          });
        }
      })

    }

    const stalk_select = async agent => {
      let disease_part = req.body.queryResult.parameters.part;
      let stalk_symptom = req.body.queryResult.parameters.Stalk_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          })
            .then(snapshot => {
              if (stalk_symptom === "ลำต้นมีจุด") {
                db.collection("textQuery")
                  .doc('stalk_spot').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('spot').get()
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
                db.collection("textQuery")
                  .doc('stalk_rot').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('rot').get()
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
                db.collection("textQuery")
                  .doc('stalk_blight').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('blight').get()
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
                db.collection("textQuery")
                  .doc('lesion').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('lesion').get()
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
                db.collection("textQuery")
                  .doc('stalk_hollow').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('hollow').get()
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
                db.collection("textQuery")
                  .doc('stalk_fall-over').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('fall over').get()
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
                db.collection("textQuery")
                  .doc('stalk_split').update({
                    sum: FieldValue.increment(1)
                  })
                return db.collection('Symptom_disease').doc('Stalk')
                  .collection('symptom').doc('shred').get()
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
            });
        }
      })
    }

    const leaf_select = async agent => {
      let disease_part = req.body.queryResult.parameters.part;
      let leaf_symptom = req.body.queryResult.parameters.Leaf_symptom;
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          return db.collection("Chat-history").doc().set({
            timestamp: currentDate,
            userId: userId,
            userText: userText,
            diseasePart: disease_part,
            provinceSymptom: pro_vince
          }).then(snapshot => {
            if (leaf_symptom === "ใบไหม้") {
              db.collection("textQuery")
                .doc('leaf_blight').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('blight').get().then(doc => {
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
              db.collection("textQuery")
                .doc('leaf_powder').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('powder').get()
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
              db.collection("textQuery")
                .doc('leaf_gall').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('gall').get()
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
              db.collection("textQuery")
                .doc('leaf_yellow').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('yellow').get()
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
              db.collection("textQuery")
                .doc('leaf_burn').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('burn').get().then(doc => {
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
              db.collection("textQuery")
                .doc('leaf_spot').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('spot').get()
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
              db.collection("textQuery")
                .doc('leaf_lesion').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('lesion').get()
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
              db.collection("textQuery")
                .doc('leaf_water-soaked').update({
                  sum: FieldValue.increment(1)
                })
              return db.collection('Symptom_disease').doc('Leaf')
                .collection('symptom').doc('water-soaked').get()
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
          });
        }
      })
    }

    const disease_card = async => {
      const d_name = req.body.queryResult.parameters.disease;
      const new_d_name = changeDiseaseName(d_name) //เข้าฟังก์ชั่นเปลี่ยนชื่อเป็นอังกฤษ
      //เข้า collection User_chatbot เพื่อเอาจังหวัดกับภาคของผู้ใช้
      return db.collection("User_chatbot").doc(userId).get().then(doc => {
        if (doc.exists) {
          const pro_vince = doc.data().userProvince
          const userRegion = doc.data().userRegion
          //ดูว่าผู้ใช้อยู่ภาคไหน แล้ว +1 ภาคนั้นใน col diseaseQuery ชื่อโรคที่ผู้ใช้เลือกดู
          if (userRegion == "ภาคเหนือ") {
            db.collection("diseaseQuery")
              .doc(new_d_name).update({
                north: FieldValue.increment(1) //ส่วน +1 ภาค นับจำนวนครั้งที่ผู้ใช้ดู
              })
          } else if (userRegion == "ภาคตะวันออกเฉียงเหนือ") {
            db.collection("diseaseQuery")
              .doc(new_d_name).update({
                northeast: FieldValue.increment(1)
              })
          } else if (userRegion == "ภาคกลาง") {
            db.collection("diseaseQuery")
              .doc(new_d_name).update({
                center: FieldValue.increment(1)
              })
          } else if (userRegion == "ภาคใต้") {
            db.collection("diseaseQuery")
              .doc(new_d_name).update({
                south: FieldValue.increment(1)
              })
          }
        }
      }).then(snapshot => {
        return queryDisease = db.collection('Disease')
          .where('diseaseNameTH', '==', d_name).get()
          .then(function (querySnapshot) {
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
              const payloadMsg = new Payload("LINE", buttonMsg, {
                sendAsMessage: true
              });
              return agent.add(payloadMsg);
            });
          });
      })
    }

    const disease_cause = async => {
      const d_name = req.body.queryResult.parameters.disease;
      return queryCause = db.collection('Disease')
        .where('diseaseNameTH', '==', d_name).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().cause)
          });
        });
    }

    const disease_symptom = async => {
      const d_name = req.body.queryResult.parameters.disease;
      return querySymptom = db.collection('Disease')
        .where('diseaseNameTH', '==', d_name).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().symptom)
          });
        });
    }

    const disease_treatment = async => {
      const d_name = req.body.queryResult.parameters.disease;
      return queryTreatment = db.collection('Disease')
        .where('diseaseNameTH', '==', d_name).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().treatment)
          });
        });
    }

    const disease_protection = async => {
      const d_name = req.body.queryResult.parameters.disease;
      return queryProtection = db.collection('Disease')
        .where('diseaseNameTH', '==', d_name).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            agent.add(doc.data().protection)
          });
        });
    }

    function changeDiseaseName(d_name) {
      if (d_name == 'โรคกาบและใบไหม้') {
        return 'BandedLeafAndSheathBlight'
      } else if (d_name == 'โรคต้นเน่าจากเชื้อมาโครโฟมิน่า') {
        return 'CharcoalRot'
      } else if (d_name == 'โรคต้นเน่าจากเชื้อฟิวซาเรี่ยม') {
        return 'FusariumStalkRot'
      } else if (d_name == 'โรคต้นเน่าจากเชื้อแบคทีเรีย') {
        return 'BacterialStalkRot'
      } else if (d_name == 'โรคโคนเน่า') {
        return 'BasalStemRot'
      } else if (d_name == 'โรคสมัท') {
        return 'CommonSmut'
      } else if (d_name == 'โรคฝัก ต้นและเมล็ดเน่าจากเชื้อดิโพลเดีย') {
        return 'DiplodiaStalkKernelAndEarRot'
      } else if (d_name == 'โรคราน้ำค้าง') {
        return 'DownyMildew'
      } else if (d_name == 'โรคใบจุด') {
        return 'LeafSpot'
      } else if (d_name == 'โรคใบไหม้แผลใหญ่') {
        return 'NorthenCornLeafBlight'
      } else if (d_name == 'โรคเมล็ดและฝักเน่าจากเชื้อราเพนิซิลเลียม') {
        return 'PenicilliumKernelAndEarRot'
      } else if (d_name == 'โรคใบไหม้แผลเล็ก') {
        return 'SouthernCornLeafBlight'
      } else if (d_name == 'โรคราสนิม') {
        return 'SouthernCornRust'
      }
    }
    //------------------------- ดูรูปเพิ่มเติม -----------------------------
    const image_carousel = async => {
      const d_image = req.body.queryResult.parameters.moreimage;
      return queryCause = db.collection('Disease')
        .where('forTemplate', 'array-contains', d_image).get()
        .then(function (querySnapshot) {
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

    //---------------------- ส่วนของแมลง ---------------------
    const insect = async => {
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
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "แสดงแมลงทั้งหมด",
                  "text": "แสดงแมลงทั้งหมด"
                }
              },
              {
                "type": "separator"
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "ค้นหาจากอาการ",
                  "text": "ค้นหาแมลงจากอาการ"
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

    const insect_carousel = async => {
      /*const snapshot = await db.collection('Insect').get()
        .then(doc => {*/
      const carouselMsg = {
        "type": "template",
        "altText": "this is a image carousel template",
        "template": {
          "type": "image_carousel",
          "columns": [
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2FFallArmyworm%2FFallArmyworm27sq.jpg?alt=media&token=93c4557f-29af-4663-9317-4c2758cc1105",
              "action": {
                "type": "message",
                "label": "กระทู้ลายจุด",
                "text": "หนอนกระทู้ข้าวโพดลายจุด"
              }
            },
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2F%20BeetArmyworm%2FBeetArmy12sq.jpg?alt=media&token=df3d83c0-a1ab-4051-b794-0cabe3bfb9e1",
              "action": {
                "type": "message",
                "label": "กระทู้หอม",
                "text": "หนอนกระทู้หอม"
              }
            },
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2FCornEarworm%2FCornEarworm16sq.jpg?alt=media&token=3aa3352b-7abd-4fa2-86b8-610ae1206044",
              "action": {
                "type": "message",
                "label": "เจาะฝัก",
                "text": "หนอนเจาะฝักข้าวโพด"
              }
            },
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2FCornBorer%2FCornBorer19sq.jpg?alt=media&token=f919ad25-71fb-4d82-bd46-9571144a6661",
              "action": {
                "type": "message",
                "label": "เจาะลำต้น",
                "text": "หนอนเจาะลำต้นข้าวโพด"
              }
            },
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2FCornLeafAphid%2FCornLeafAphid24sq.jpg?alt=media&token=28303b36-bfcc-4222-887c-c33c36fcc446",
              "action": {
                "type": "message",
                "label": "เพลี้ยอ่อน",
                "text": "เพลี้ยอ่อนข้าวโพด"
              }
            },
            {
              "imageUrl": "https://firebasestorage.googleapis.com/v0/b/chatbot-baac-cdplft.appspot.com/o/Insect%2FRiceLeafFolder%2FRiceLeafFolder8sq.jpg?alt=media&token=22f660e1-2022-4dbb-9a66-ccd7803b280d",
              "action": {
                "type": "message",
                "label": "หนอนห่อใบ",
                "text": "หนอนห่อใบข้าวในข้าวโพด"
              }
            }
          ]
        }
      }
      const payloadMsg = new Payload("LINE", carouselMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
      //});
    }

    const insect_select = async => {
      const insectName = req.body.queryResult.parameters.insect;
      return queryCause = db.collection('Insect')
        .where('insectName', '==', insectName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const cardMsg = {
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
                      "type": "spacer"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().insectName}`,
                      "size": "lg",
                      "align": "center",
                      "weight": "bold"
                    },

                    {
                      "type": "box",
                      "layout": "baseline",
                      "margin": "lg",
                      "contents": [
                        {
                          "type": "filler"
                        },
                        {
                          "type": "icon",
                          "size": "sm",
                          "margin": "none",
                          "url": `${doc.data().damageRate[0]}`
                        },
                        {
                          "type": "icon",
                          "size": "sm",
                          "url": `${doc.data().damageRate[1]}`
                        },
                        {
                          "type": "icon",
                          "size": "sm",
                          "url": `${doc.data().damageRate[2]}`
                        },
                        {
                          "type": "icon",
                          "size": "sm",
                          "url": `${doc.data().damageRate[3]}`
                        },
                        {
                          "type": "icon",
                          "size": "sm",
                          "url": `${doc.data().damageRate[4]}`
                        },
                        {
                          "type": "filler"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "margin": "xs",
                      "contents": [
                        {
                          "type": "text",
                          "size": "sm",
                          "text": "ระดับความเสียหาย:",
                          "color": "#000000",
                          "align": "center",
                          "wrap": true
                        },
                        {
                          "type": "text",
                          "size": "sm",
                          "text": `${doc.data().damage}`,
                          "wrap": true
                        }
                      ]
                    }
                    ,
                    {
                      "type": "separator",
                      "margin": "lg"

                    },
                    {
                      "type": "text",
                      "text": "ลักษณะแมลง",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().Identification['egg']}` + "\n"
                        + `${doc.data().Identification['larva']}` + "\n"
                        + `${doc.data().Identification['adult']}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": "พบ/ระบาด",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().condition}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "separator",
                      "margin": "lg"
                    },
                    {
                      "type": "text",
                      "text": "ความเสียหาย",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().action}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "separator",
                      "margin": "lg"
                    },
                    {
                      "type": "text",
                      "text": "แมลงศัตรูธรรมชาติ",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().naturalEnermy}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": "เชื้อโรคกำจัด",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().biologicalControl}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": "สารเคมี",
                      "margin": "lg",
                      "color": "#000000"
                    },
                    {
                      "type": "text",
                      "text": `${doc.data().insecticide[0]}` + "\n"
                        + `${doc.data().insecticide[1]}` + "\n"
                        + `${doc.data().insecticide[2]}` + "\n"
                        + `${doc.data().insecticide[3]}`,
                      "size": "sm",
                      "wrap": true
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "ความเสียหาย",
                        "text": "ความเสียหายจาก" + `${doc.data().insectName}`
                      },
                      "margin": "lg",
                      "height": "sm",
                      "style": "secondary"
                    }
                  ]
                }
              }
            }
            const payloadMsg = new Payload("LINE", cardMsg, {
              sendAsMessage: true
            });
            return agent.add(payloadMsg);
          });
        });
    }

    const chartBytext = async => {
      const increment = firebase.firestore.FieldValue.increment(1);

    }

    let intentMap = new Map();
    // province
    intentMap.set("User province", user_province);

    // App
    intentMap.set("App Suggestion", app_suggestion);

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

    // Pest
    intentMap.set('Insect', insect);
    intentMap.set('Insect Carousel', insect_carousel);
    intentMap.set('Insect Carousel - select', insect_select);

    // Chart
    intentMap.set('Chart', chartBytext);

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
