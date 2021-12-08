// const nlp = require("compromise")

// let doc = nlp("Nothing much")

// let arr = []

// console.log(doc.out('tags'))

// arr = doc.out('tags')

// console.log(arr);

// function wrap_up(agent) {
//    var obj = {};
//    for(let n of arr) {
//       obj[n] = true;
//    }
//    let b = Object.keys(obj);
//    console.log(b);
//    var i = increment();
//    if(i == 0) {
//       agent.add("After learning the proper things to do in different situations, I will ask you some  questions again, just to know how much you’ve learned.");
//       agent.add(stories[b[i]].quiz.shift());
//    } else {
//       agent.add(stories[b[i]].quiz.shift());
//    }
// }

// intentMap.set('7_reprompt_social_story', repromptActivity);
// intentMap.set('3_casual_conversation', promptCasualConversation);
// intentMap.set('3_casual_conversation - custom', promptCasualConversation);
// intentMap.set('4_prompt_social_story', promptSocialStory);
// intentMap.set('prompt_quiz', wrap_up);
// intentMap.set('prompt_quiz_1', wrap_up);

// function giveActivity(agent) {
   // var verb = agent.context.get('prepare_activity').parameters['verb.original']
   // var theme = agent.context.get('prepare_social_story').parameters['themes.original']
   
   // let modVerb = nlp(verb).verbs().toInfinitive()
   // let modTheme = nlp(theme).verbs().toInfinitive()
   
   // if(verb){
   //    agent.add("What did you " + modVerb.text() + "?")
   // } else {
   //    agent.add("What did you " + modTheme.text() + "?")
   // }
   // var query = agent.query
   // var input = nlp(query).verbs().toInfinitive().text().toLowerCase()

   // const parameters = {
   //    query: query,
   // };
   // agent.context.set('test-intent', 1, parameters);

   // agent.add("What did you " + input + "?")
   // console.log(query);
// }

// console.log(JSON.stringify(agent.context.get('variable'), null, 3))