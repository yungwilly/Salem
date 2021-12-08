const { response } = require('express');
const stories = require('./tempTemplates.json');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./testDB.db', sqlite3.OPEN_READONLY, (err) => {
   if (err) {
      return console.error(err.message);
   }
});

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

async function getTableName() {
   let tblArr = []
   try {
      const row = await pushTableName()
      for(i = 0; i < row.length; i++){
         tblArr[i] = row[i];
      }
   } catch(err) {
      console.log(err)
   }
}

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

async function getMessage(table) {
   let rowArr = []
   try {
      row = await pushMessage(table)
      for(i = 0; i < row.length; i++){
         rowArr[i] = row[i].toLowerCase();
      }
   } catch(err) {
      console.log(err)
   }
}

let template = stories.themes.descriptive.split(" ");

async function compareTags() {
   try {
      let tableName = getTableName();
      for(i = 0; i < template.length; i++){
         if(template[i].includes('$')){
            for(j = 0; j < tableName.length; j++){
               if(template[i].includes('$' + tableName[j])){
                  let table = tableName[j].charAt(0).toUpperCase() + tableName[j].slice(1);
                  let message = await pushMessage(table);
                  var id = Math.floor(Math.random() * message.length);
                  template[i] = message[id]
               }
            }
         }
      }
      console.log(template.join(" "))
   } catch(err) {
      console.log(err)
   }
}

db.close((err) => {
   if (err) {
      return console.error(err.message);
   }
});

module.exports = { pushMessage, pushTableName, getMessage, getTableName }