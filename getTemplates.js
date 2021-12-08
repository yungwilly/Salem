const templates = require('./tempTemplates.json');
const nlp = require('compromise');
const db = require('./dbConnect.js');
const fs = require('fs');

function getDescriptive(social_story, themes, target) { // add verb in parameters
   var temp = templates.themes.descriptive.split(" ")
   var temp1 = templates.themes[themes].directive[0].split(" ")
   var temp2 = templates.themes[themes].question[0].split(" ")
   var newTemp = temp.concat(temp1).concat(temp2)
   
   for (i = 0; i < newTemp.length; i++) {
      if (newTemp[i].includes('<social_story>')) {
         newTemp[i] = social_story
      } else if (newTemp[i].includes('<theme>')) {
         newTemp[i] = themes
      } else if (newTemp[i].includes('<target>')) {
         newTemp[i] = target
      } 
   }

   return newTemp = newTemp.join(" ").toString()
}

// function getPerspective(themes) {
//    var newTemp = templates.themes[themes].perspective[0].split(" ")

//    for(i = 0; i < newTemp.length; i++){
//       for(j = 0; j < tableName.length; j++){
//          if(newTemp[i].includes('$' + tableName[j])){
//             let table = tableName[j];
//             const message = db.pushMessage(table);
//             var id = Math.floor(Math.random() * message.length);
//             newTemp[i] = message[id]
//          }
//       }
//    }
//    return newTemp = newTemp.join(" ").toString()
// }

function getAffirmative(social_story, themes, target) {
   var newTemp = templates.themes[themes].affirmative[0].split(" ")
   
   for (i = 0; i < newTemp.length; i++) {
      if (newTemp[i].includes('<social_story>')) {
         newTemp[i] = social_story
      } else if (newTemp[i].includes('<theme>')) {
         newTemp[i] = themes
      } else if (newTemp[i].includes('<target>')) {
         newTemp[i] = target
      } 
   }

   return newTemp = newTemp.join(" ").toString()
}

// console.log(getAffirmative("friend's house", "CLAYGO", "friend"))

function getReprimand(social_story, themes, target) {
   var newTemp = templates.themes[themes].reprimand[0].split(" ")
   
   for (i = 0; i < newTemp.length; i++) {
      if (newTemp[i].includes('<social_story>')) {
         newTemp[i] = social_story
      } else if (newTemp[i].includes('<theme>')) {
         newTemp[i] = themes
      } else if (newTemp[i].includes('<target>')) {
         newTemp[i] = target
      } 
   }

   return newTemp = newTemp.join(" ").toString()
}

module.exports = { getDescriptive, getAffirmative, getReprimand }