# Chatbot_BAAC_finalproject
## วิธี Clone Project
1. เปิด cmd แล้วเลือกพื้นที่ในคอม เช่น \Desktop
2. พิมพ์คำสั่ง git clone https://github.com/Kengkarn/Chatbot_BAAC_finalproject.git
> *รอสักแปบ ถ้าโหลดเสร็จก็ถือว่าเรียบร้อย*

## สิ่งที่ต้องมี
1. โปรแกรม [Visual Studio Code](https://code.visualstudio.com/)
   * เลือกระบบปฏิบัติการ แล้วเลือกตัวดาวน์โหลดที่เป็น Stable
2. Node JS
   * วิธีเช็ค: เปิด cmd พิมพ์คำสั่ง node -v
   > *หากขึ้นเลข version แสดงว่าติดตั้งเรียบร้อยแล้ว OK!!*
   * ในกรณีที่ไม่มี ให้ไปโหลด => [Node.js](https://nodejs.org/en/)
   > *เลือกอันทางซ้าย Recommended For Most Users*
3. npm : Node Package Manager
> ส่วนใหญ่มาพร้อมกับ Node JS
   * วิธีเช็ค: เปิด cmd พิมพ์คำสั่ง npm -v
4. Firebase
   * วิธีเช็ค: เปิด cmd พิมพ์คำสั่ง firebase --version
   > *จะขึ้นเลข version*
   * ในกรณีที่ไม่มี สามารถโหลดโดยการพิมพ์คำสั่ง npm install -g firebase-tools
   > *รอจนกว่าจะเสร็จ แล้วเช็คเลข version อีกที*
   
## วิธีการทำงานใน Visual Studio Code
1. เปิดโปรแกรม Visual Studio Code
2. ไปที่แท็ป file -> open folder...
3. เลือกโปรเจคที่ Clone มา
4. เปิด Terminal ในโปรแกรม Visual ไปที่แท็ป Terminal -> New Terminal
![หน้าต่าง terminal ในโปรแกรม](https://i.ibb.co/r2fzw8c/Capture.png)
   > หน้าต่าง terminal ในโปรแกรม
5. เช็ค firebase --version
6. พิมพ์คำสั่ง firebase login
   * กด Y แล้วกด enter จะขึ้นหน้าเว็บให้ login
   * ทำการ login ด้วย Account ที่ใช้ทำโปรเจค
7. การ deploy project
   * พิมพ์คำสั่ง **firebase deploy --only functions**
   > *ใช้บ่อย จำหน่อยก็ดี*
   
## วิธีการอัปโค้ดขึ้น Github
1. เปิด Folder Project ขึ้นมา คลิกที่ Path แล้วพิมพ์ cmd และกด enter
![ภาพตัวอย่าง](https://i.ibb.co/fnVtsLk/Untitled.png)
   > ภาพตัวอย่าง
2. พิมพ์คำสั่ง git add .
> เป็นการเพิ่ม file ที่มีการแก้ไขทั้งหมด(add หลายไฟล์)ลงใน staged
   ### add ไฟล์เดียว
      git add <file_name>

   ### add หลายไฟล์
      git add .

   ### add หลายไฟล์ระบุนามสกุล
      git add *.html

3. พิมพ์คำสั่ง git commit -m "ข้อความอธิบายการเปลี่ยนแปลง"
> เป็นการ commit file ที่อยู่ใน staged ลงในเครื่อง local
4. พิมพ์คำสั่ง git push origin master
> เป็นการ push โค้ดขึ้นไปบน Remote Repository ลงใน branch master
### \*** จำไว้ว่าทุกครั้งที่จะแก้ไขโค้ดให้ Pull จาก Remote Repository ลงมาก่อน \***
> อาจสำรองโค้ดเดิมไว้ก่อนก็ได้ เผื่อบึ้ม!!
* โดยการ
   * พิมพ์คำสั่ง  git pull origin master
   
#### ศึกษาเพิ่มเติม: [คำสั่ง Git ที่ใช้งานบ่อย](https://www.memo8.com/git-basic-command/)

