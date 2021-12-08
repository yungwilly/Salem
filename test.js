// const nlp = require('compromise')
// const doc = nlp('i like watching TV')
// let doc = nlp()
// if(doc.has('#Verbs').text() == true)
//    console.log('true')
// else
//    console.log('false')
// console.log(doc.out('tags'))
// console.log(doc.match('#verb').out('array'))
// doc.verbs().toPresentTense()
// console.log(doc.text())

// function st(a) {
//    return a + " test"

// }
// module.exports = { st }

// const doc = nlp('The quick brown fox jumps over the lazy dog')
// const doc = nlp(st.query)

// if(doc.match('#Person').text())
//    console.log('Introduction')
//console.log(doc.match('#Adjective').text())
// console.log(doc.topics().json())
// console.log(st)

// var a = "This is a test sentence from the NLU"
// module.exports = {a}

// console.log(st.query)

// console.log(doc.out('tags')) 
// doc.debug()

// function doReply(input) {
//    let doc = nlp(input, {hi:'Greeting', hey:'Greeting', yo:'Greeting'})
//    doc.debug()
//    if(doc.match('#Greeting').terms().text()) {
//       return 'Hello again!'
//    } else if (doc.match('#Noun').terms().text()) {
//       return 'Me too'
//    } else if (doc.match('#Noun || #Pronoun').match('#Adverb').terms().text()) {
//       return 'Noun + Adverb'
//    } else if (doc.match('#Noun || #Pronoun').match('#Adjective').terms().text()) {
//       return 'Noun + Adjective'
//    } else if (doc.match('#Subject').match('#Predicate').terms().text()) {
//       return input
//    } else {
//       return 'Sorry, I didn\'t get that.'
//    }
// }
// module.exports = { doReply }

// function cat(input) {

// }

// const sqlite3 = require('sqlite3').verbose();
// const db = require('./dbConnect.js');
// let test = db.compareTags()
// let db = new sqlite3.Database('./testDB.db', sqlite3.OPEN_READONLY, (err) => {
//    if (err) {
//       return console.error(err.message);
//    }
//    console.log('-------------------------');
//    console.log('| Connected to database |');
//    console.log('-------------------------');
// });

// function pushTableName() {
//    let tblArr = [];
//    return new Promise((resolve, reject) => {
//       db.all("SELECT * FROM Social_Story, Theme WHERE Social_Story.ssID = Theme.themeID", [], (err, rows) => {
//          if (err) {
//             return console.error(err.message);
//          }
//          rows.forEach((row) => {
//             tblArr.push(row);
//          });
//          resolve(tblArr)
//       });
//    })
// }

// async function test() {
//    const test = await pushTableName()
//    console.log(test)
// }

// test()

// const nlp = require('compromise');

// function hasVerb(input) {
//    let doc = nlp(input)
//    let verb = doc.match('#verb').text()

//    if(doc.has('#verb')) {
//       return true
//    } else {
//       return false
//    }
// }

// function getVerb(input) {
//    let doc = nlp(input)
//    let verb = b
// }

// const db = require('./dbConnect.js')
// db.getTableName()
// db.getMessage()
// console.log(db.compareTags());

// const temp = require('./getTemplates.js')
// const a = require('./responses.json')
// const db = require('./dbConnect.js')
// const nlp = require('compromise')

// var b = temp.getDescriptive("friend's house", "CLAYGO", "friend");
// var input = "I went shopping with my mom"
// var doc = nlp(input).nouns().text()
// var doc1 = nlp(input)
// console.log(doc);
// console.log(doc1.out('tags'))
// console.log(temp.getDescriptive("friend's house", "CLAYGO", "friend"));

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var result = sentiment.analyze("throw the trash away").score;
console.log(result); // Score: -2, Comparative: -0.666

// const nlp = require('compromise')
// nlp.extend(require('compromise-sentences'))
// let doc = nlp('I played games').nouns().text()
// // console.log(doc.sentences().subjects().text());
// console.log(doc);

// let doc = nlp('i like playing with my friends and listening to music')

// console.log(doc.nouns().text());

// const nlp = require('compromise')
// let input = nlp('clean')
// var verb = input.verbs().toGerund().text()
// var a = input.verbs().toInfinitive().text()
// var noun = input.nouns().text()
// console.log(input.out('tags'));

// nlp.extend((Doc, clean) => {
//    // add new tags
//    clean.addTags({
//       Character: {
//          isA: 'Verb',
//          // notA: 'Adjective',
//       },
//    })
// })
   
// console.log(input.out('tags'));

   // const nlp = require('compromise')
   // nlp.extend(require('compromise-sentences'))
   // let doc = nlp('we are going to the gym')
   // console.log(doc.sentences().subjects().text());
   // console.log(doc.topics().text());
   
   
   // console.log(doc.topics(doc).places().first().text());
   // console.log("\n");
   // console.log(doc.topics().json());
   // [
   //   { text: 'richard nixon' },
   //   { text: 'china' }
   // ]
   
   
   // module.exports = { hasVerb }