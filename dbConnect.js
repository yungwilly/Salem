const { response } = require('express');
const stories = require('./tempTemplates.json');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./testDB.db', sqlite3.OPEN_READONLY, (err) => {
   if (err) {
      return console.error(err.message);
   }
   console.log('-------------------------');
   console.log('| Connected to database |');
   console.log('-------------------------');
});
// add SSID (Social Story ID) column in each table for database to accomodate contexts

function pushTableName() {
   let tblArr = [];
   return new Promise((resolve, reject) => {
      db.all("SELECT name FROM sqlite_master WHERE type = 'table'", [], (err, rows) => {
         if (err) {
            return console.error(err.message);
         }
         rows.forEach((row) => {
            tblArr.push(row.name.toLowerCase());
         });
         resolve(tblArr)
      });
   })
}

// async function getTableName() {
//    try {
//       row = await pushTableName()
//       for(i = 0; i < row.length; i++){
//          tblArr[i] = row[i].toLowerCase();
//       }
//    } catch(err) {
//       console.log(err)
//    }
//    console.log(tblArr)
// }

// let stmt = `SELECT adjectiveID, message FROM Adjective WHERE adjectiveID = ?`;
// modify main function to dynamically SELECT tables
// let table = 'Adjective'
// let rowSql = `SELECT message FROM` + " " + table;

function pushMessage(table) {
   let rowArr = [];
   return new Promise((resolve, reject) => {
      db.all(`SELECT message FROM ` + table, [], (err, rows) => {
         if (err) {
            return console.error(err.message);
         }
         rows.forEach((row) => {
            rowArr.push(row.message.toLowerCase());
         });
         resolve(rowArr)
      });
   })
}
// I want to greet the birthday celebrant
// tell me more
// what else can you say?
// async function getMessage() {
//    try {
//       row = await pushMessage()
//       for(i = 0; i < row.length; i++){
//          rowArr[i] = row[i].toLowerCase();
//       }
//    } catch(err) {
//       console.log(err)
//    }
//    console.log(rowArr)
// }

// async function modTemplate(template) {
//    // console.log(records)
//    let tempTemplate = template.split(" ");
//    try {
//       records = await pushMessage();
//       for(i = 0; i < tempTemplate.length; i++){
//          var j = Math.floor(Math.random() * 13) + 1;
//          if(tempTemplate[i].includes('$adjective')){
//             var key = tempTemplate[i].toString()
//             tempTemplate[i] = key.replace(tag, records[j])
//             // console.log(tempTemplate[i])
//          }
//       }
//    } catch(err) {
//       console.log(err)
//    }
//    let newTemplate = tempTemplate.join(" ");
//    console.log(newTemplate)
// }

let template = stories.social_story.descriptive.shift().split(" ");
// let template = "<social_story> is $adjective and $adjective".split(" ");
// let tag = /[$]adjective/;
// let tableName = []
// let message = []

async function compareTags() {
   // console.log(template)
   try {
      let tableName = await pushTableName();
      //let [tableName, message] = await Promise.all([pushTableName(), pushMessage()]); // separate these Promises
      for(i = 0; i < template.length; i++){
         if(template[i].includes('$')){
            for(j = 0; j < tableName.length; j++){
               if(template[i].includes('$' + tableName[j])){
                  let table = tableName[j].charAt(0).toUpperCase() + tableName[j].slice(1);
                  let message = await pushMessage(table);
                  var id = Math.floor(Math.random() * message.length);
                  // var key = template[i].toString()
                  // let tag = /[$]adjective/; // fix tags
                  // template[i] = key.replace(tag, message[id])
                  template[i] = message[id]
                  // console.log(template[i])
                  // console.log(message)
                  // console.log(table + ": " + message.length + " id: " + id)
               }
            }
         }
      }
      console.log(template.join(" "))
      // console.log(tableName)
      // console.log(message)
      // console.log(template.length)
      // modTemplate(template)
   } catch(err) {
      console.log(err)
   }
}

compareTags()

// db.close((err) => {
//    if (err) {
//       return console.error(err.message);
//    }
//    console.log('------------------------------');
//    console.log('| Closed database connection |');
//    console.log('------------------------------');
// });