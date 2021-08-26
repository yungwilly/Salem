const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./testDB1.db', sqlite3.OPEN_READONLY, (err) => {
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
let adjectiveID = Math.floor(Math.random() * 13) + 1;;

// first row only
db.get(stmt, [adjectiveID], (err, row) => {
   if (err) {
      return console.error(err.message);
   }
   return row
   ? console.log(row.message)
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