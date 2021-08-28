const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./testDB.db', sqlite3.OPEN_READONLY, (err) => {
   if (err) {
      return console.error(err.message);
   }
   console.log('-------------------------');
   console.log('| Connected to database |');
   console.log('-------------------------');
});

function WordCount(str) { 
   return str.split(" ").length;
}

let template = "$social_story is $adjective and $adjective. There are some things you need to remember when $verb at a $location. If you remember these things, you will have a $adjective time and the $target will be happy that you $verb at the $location.";
var newTemplate = template.split(" ");

let stmt = `SELECT adjectiveID, message FROM Adjective WHERE adjectiveID  = ?`;
let re = /[$]adjective/;
for(i = 0; i < WordCount(template); i++){
   if(newTemplate[i].includes('$adjective')){
      let adjectiveID = Math.floor(Math.random() * 13) + 1;
      let a = newTemplate[i].toString()
      db.get(stmt, [adjectiveID], (err, row) => {
         if (err) {
            return console.error(err.message);
         }
         return row
         ? console.log(a.replace(re, row.message))
         : console.log(`No playlist found with the id ${adjectiveID}`);
      });
   }
}


db.close((err) => {
   if (err) {
      return console.error(err.message);
   }
   console.log('------------------------------');
   console.log('| Closed database connection |');
   console.log('------------------------------');
});