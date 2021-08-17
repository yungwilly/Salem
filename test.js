const nlp = require('compromise')

// function st(a) {
//    return a + " test"
   
// }
// module.exports = { st }

//const doc = nlp('The quick brown fox jumps over the lazy dog')
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

function doReply(input) {
   let doc = nlp(input, {hi:'Greeting', hey:'Greeting', yo:'Greeting'})
   doc.debug()
   if(doc.match('#Greeting').terms().text()) {
      return 'Hello again!'
   } else if (doc.match('#Noun').terms().text()) {
      return 'Me too'
   } else if (doc.match('#Noun || #Pronoun').match('#Adverb').terms().text()) {
      return 'Noun + Adverb'
   } else if (doc.match('#Noun || #Pronoun').match('#Adjective').terms().text()) {
      return 'Noun + Adjective'
   } else if (doc.match('#Subject').match('#Predicate').terms().text()) {
      return input
   } else {
      return 'Sorry, I didn\'t get that.'
   }
}
module.exports = { doReply }

function cat(input) {

}