const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./testDB.db', sqlite3.OPEN_READONLY, (err) => {
   if (err) {
      return console.error(err.message);
   }
   console.log('-------------------------');
   console.log('| Connected to database |');
   console.log('-------------------------');
});

// let stmt = `SELECT * FROM Adjective`;

// db.all(stmt, [], (err, rows) => {
//    if (err) {
//       throw err;
//    }
//    rows.forEach((row) => {
//       console.log(row);
//    });
// });

// const str = 'The $adjective fox $verb over the $target';
// let a = str.replace("$adjective", "quick");
// console.log(a);

let stmt = `SELECT adjectiveID, message FROM Adjective WHERE adjectiveID  = ?`;
let adjectiveID = Math.floor(Math.random() * 13) + 1;
let template = "$social_story is $adjective and $adjective. There are some things you need to remember when $verb at a $location. If you remember these things, you will have a $adjective time and the $target will be happy that you $verb at the $location.";

db.each(stmt, [adjectiveID], (err, row) => {
   let re = /[$]adjective/g;
   if (err) {
      return console.error(err.message);
   }
   return row
   ? console.log(template.replace(re, row.message))
   : console.log(`No playlist found with the id ${adjectiveID}`);
});

db.close((err) => {
   if (err) {
      return console.error(err.message);
   }
   console.log('------------------------------');
   console.log('| Closed database connection |');
   console.log('------------------------------');
});