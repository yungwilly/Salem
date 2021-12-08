"use strict"
const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
//const admin = require('firebase-admin');
//const actions = require('actions-on-google');
const { Suggestion } = require('dialogflow-fulfillment');
//const { BasicCard } = require('actions-on-google');
const serviceAccount = require('./testbot-fmgx-980d5afb8812.json');
//const { convert } = require('actions-on-google/dist/service/actionssdk');
// const stories = require('./social_stories.json');
// const nlp = require('./test.js');
const nlp = require('compromise');
// const db = require('./dbConnect.js');
// const responses = require('./responses.json');
const templates = require('./tempTemplates.json');
// const dummy = require('./dummy.js');
const getTemp = require('./getTemplates');
// const test = require('./test.js')
const Sentiment = require('sentiment');

var increment = (function(n) {
   return function() {
      n += 1;
      return n;
   }
}(0));

app.get('/', (req, res) => {
   res.send("We are live!!!");
});

app.post('/', express.json() ,(req, res) => {
   const agent = new df.WebhookClient({
      request : req,
      response : res
   });

   function getName(agent) {
      var query = agent.query

      var name = agent.context.get('awaiting_name').parameters['person'];

      name = name.charAt(0).toUpperCase() + name.slice(1);

      agent.add("Hello " + name + "! It's nice to meet you, have you ever used a chatbot before?");
      
      const parameters = { 'person': name };
      agent.context.set('used_chatbot', 1, parameters)

      console.log(query);
   } 
   
   function hasUsedChatbot(agent) {
      var query = agent.query

      var name = agent.context.get('used_chatbot').parameters['person']
      var yes_or_no = agent.context.get('used_chatbot').parameters['yes_or_no'];

      if (yes_or_no == 'yes'){
         agent.add("Great! I'm excited to know more about you! How are you today?");
      } else {
         agent.add("A chatbot is a computer program that talks like a human! I am glad to be the first chatbot you'll talk with. I was designed as a self-esteem enhancement chatbot, I hope we get along! How are you today?");
      }
      
      const parameters = { 'person': name };
      agent.context.set('give_sentiment', 1, parameters)

      console.log(query);
   }

   function giveSentiment(agent) {
      var query = agent.query

      var name = agent.context.get('give_sentiment').parameters['person'];
      var sent = agent.context.get('give_sentiment').parameters['sentiment']

      name = name.charAt(0).toUpperCase() + name.slice(1);

      var sentiment = new Sentiment();
      var result = sentiment.analyze(query).score;

      if (sent == 'positive'){
         agent.add("I'm glad to know that, " + name + "! What did you do today?");
      } else if (sent == 'negative') {
         agent.add("I'm sorry to hear that, things will surely get better, I believe in you! Now tell me, " + name + ", what did you do today?");
      } else if (result == 0) {
         agent.add("What did you do today, " + name + "?")
      }

      agent.context.set('give_activity', 1)

      console.log(query);
   }

   function giveActivity(agent) {
      var query = agent.query

      var any = agent.context.get('give_activity').parameters['any']
      var theme = agent.context.get('give_activity').parameters['themes']
      var object = agent.context.get('give_activity').parameters['direct_object']
      var none = agent.context.get('give_activity').parameters['none']

      var modVerb = nlp(query).verbs().toGerund().text().toLowerCase()
      modVerb = nlp(modVerb).verbs().toInfinitive().text().toLowerCase()
      
      var modTheme = nlp(query).verbs().toGerund().text().toLowerCase()
      modTheme = nlp(modTheme).verbs().toInfinitive().text().toLowerCase()

      if (none != "") {
         // const parameters = { 'social_stories': story, 'themes': theme, 'target': target };
         agent.context.set('suggest_theme', 1)
         agent.add("Would you like me to suggest a topic?") // repeats with "nothing much" input
      } else if (any != "") {
         const parameters = { 'query': modVerb };
         agent.context.set('prepare_activity', 1, parameters);
         agent.add("What did you " + modVerb + "?")
      } else if (any == "") {
         const parameters = { 'themes': theme, 'themes.original': modTheme };
         agent.context.set('prepare_social_story', 1, parameters);
         agent.add("What did you " + modTheme + "?")
      }

      console.log(query);
   }

   function prepareActivity(agent) {
      var query = agent.query

      var verb = agent.context.get('prepare_activity').parameters['query']
      var object = agent.context.get('prepare_activity').parameters['any']

      let modVerb = nlp(verb).verbs().toGerund().text().toLowerCase()
      let modNoun = nlp(object).nouns().text().toLowerCase()

      const parameters = { query: verb, };
      agent.context.set('affirm_activity', 1, parameters)

      agent.add("Do you like " + modVerb  + " " + modNoun + " with others?")

      agent.context.set('affirm_activity', 1)
      console.log(query);
   }

   function affirmActivity(agent) {
      var query = agent.query

      var yes_or_no = agent.context.get('affirm_activity').parameters['yes_or_no']
      var verb = agent.context.get('affirm_activity').parameters['query']

      let doc = nlp(verb).verbs().toGerund().toTitleCase().text()
      let root = nlp(verb).verbs().toInfinitive().text().toLowerCase()

      const yes = [
         "It's a lot of fun to " + root + " with others! You can both learn a lot from each other and become wonderful friends in the end!",
         doc + " with others is fun! You can learn lots of things from each other and eventually you can be good friends!",
         doc + " with others is a lot of fun! You can both learn a lot from each other and end up becoming great friends!"
      ];

      const no = [
         "That's fine! It's fine to" + root + " alone, and it can even be enjoyable!",
         "That's okay! " + doc + " on your own is perfectly fine and can be fun too!",
         "That's all right! It's fine to " + root + " by yourself, and it can even be fun!"
      ]
      
      var yesRand = Math.floor(Math.random() * yes.length);
      var noRand = Math.floor(Math.random() * no.length);

      const tagQuestion = "What else did you do today?"
      const suggestActivity = "Would you like me to suggest a topic?"

      var counter = increment()

      if (counter % 4 != 0) {
         if (yes_or_no == 'yes'){
            agent.add(yes[yesRand])
            agent.add(tagQuestion)
         } else {
            agent.add(no[noRand])
            agent.add(tagQuestion)
         }
         agent.context.set('give_activity', 1)
      } else {
         if (yes_or_no == 'yes'){
            agent.add(yes[yesRand])
            agent.add(suggestActivity)
         } else {
            agent.add(no[noRand])
            agent.add(suggestActivity)
         }
         agent.context.set('suggest_theme', 1)
      }

      console.log(query);
   }

   function prepareSocialStory(agent) {
      var query = agent.query

      var themes_original = agent.context.get('prepare_social_story').parameters['themes.original']
      var theme = agent.context.get('prepare_social_story').parameters['themes']
      var object = agent.context.get('prepare_social_story').parameters['any']

      let doc = nlp(theme).verbs().text().toLowerCase()
      let noun = nlp(object).nouns().text().toLowerCase()
      
      agent.add("Do you like to " + themes_original + " " + noun + " with others?")

      const parameters = { 'themes': theme, 'themes.original': themes_original, 'any': object, }
      agent.context.set('prepare_social_story_target', 1, parameters)

      console.log(query);
   }

   function returnActivity(agent) {
      var query = agent.query

      var yes_or_no = agent.context.get('return_activity').parameters['yes_or_no']
      var any = agent.context.get('return_activity').parameters['any']

      agent.add("What else did you do today?")

      agent.context.set('give_activity', 1)
      console.log(query);
   }

   function prepareSocialStoryTarget(agent) {
      var query = agent.query

      var theme = agent.context.get('prepare_social_story_target').parameters['themes']
      var themes_original = agent.context.get('prepare_social_story_target').parameters['themes.original']
      var object = agent.context.get('prepare_social_story_target').parameters['any']
      var yes_or_no = agent.context.get('prepare_social_story_target').parameters['yes_or_no']

      console.log(theme);
      var doc = nlp(theme).verbs().toGerund().text().toString().toLowerCase()
      console.log(doc);
      var modTheme = nlp(doc).verbs().toInfinitive().text().toLowerCase()
      console.log(modTheme);
      var modObject = nlp(object).nouns().text().toLowerCase()

      if (yes_or_no == 'yes') {
         agent.add("Who do you usually " + themes_original + " " + modObject + " with?")
         const parameters = { 'themes.original': themes_original, 'themes': theme, 'any': object }
         agent.context.set('affirm_social_story', 1, parameters)
      } else if(yes_or_no == 'no'){
         agent.add("That's okay! What else did you do today?")
         agent.context.set('return_activity', 1)
      }
      console.log(query);
   }

   function affirmSocialStory(agent) {
      var query = agent.query

      var themes = agent.context.get('affirm_social_story').parameters['themes']
      var themes_original = agent.context.get('affirm_social_story').parameters['themes.original']
      var object = agent.context.get('affirm_social_story').parameters['any']
      var target = agent.context.get('affirm_social_story').parameters['target']
      
      var verb = nlp(themes_original).verbs().toGerund().text().toLowerCase()
      verb =  nlp(themes_original).verbs().toInfinitive().text().toLowerCase()
      let modObject = nlp(object).nouns().text().toLowerCase()

      agent.add("Where do you usually " + verb + " " + modObject + "?")
      const parameters = { 'themes': themes, 'themes.original': themes_original, 'target': target }
      agent.context.set('prompt_social_story', 1, parameters)
      console.log(query);
   }

   function suggestTheme(agent) {
      var yes_or_no = agent.context.get('suggest_theme').parameters['yes_or_no']

      const stories = [
         "birthday", "mall", "museum", "school", "playing with friends", "movie", "friend's house",
         "field trip", "family day", "amusement park", "visiting grandparents", "zoo"
      ]

      const themes = [
         "greeting", "making friends", "playing and joining", "eating", "celebrate", "waiting for food", "lining up",
         "helping", "reciting", "school rules", "sharing toys", "winning or losing", "saying thank you", "keeping quiet", 
         "CLAYGO", "thanking friend's parents"
      ]

      const targets = [
         "friends", "family"
      ]

      var storyRand = Math.floor(Math.random() * stories.length);
      var themeRand = Math.floor(Math.random() * themes.length);
      var targetRand = Math.floor(Math.random() * targets.length);

      var story = stories[storyRand]
      var theme = themes[themeRand]
      var target = targets[targetRand]

      if (yes_or_no == 'yes') {
         agent.add("Do you want to talk about going to " + story + "?")
         console.log(`Social Story: ${story} // Theme: ${theme} // Target: ${target}`);
         const parameters = { 'themes': theme, 'social_stories': story, 'target': target }
         agent.context.set('prompt_suggestion', 1, parameters)
      } else {
         agent.add("What else did you do today?")
         agent.context.set('give_activity' , 1)
      }
   }

   function promptSuggestion(agent) {
      // copy promptSocialStory but using the suggestTheme parameters then pass it to choosePerspective
      var query = agent.query
      // social_story is gotten from utterance so passing it from 'suggest_theme' won't work
      var social_story = agent.context.get('prompt_suggestion').parameters['social_stories']
      var theme = agent.context.get('prompt_suggestion').parameters['themes']
      var target = agent.context.get('prompt_suggestion').parameters['target']
      var yes_or_no = agent.context.get('prompt_suggestion').parameters['yes_or_no']

      console.log(`Social Story: ${social_story} // Theme: ${theme} // Target: ${target}`);

      if (yes_or_no == 'yes') {
         const parameters = { 'target': target, 'themes': theme, 'social_stories': social_story}
         agent.context.set('choose_perspective', 1, parameters)
         agent.add(getTemp.getDescriptive(social_story, theme, target))
      } else {
         agent.add("Do you want me to suggest a different topic?")
         agent.context.set('suggest_theme', 1)
      }
      
      console.log(query);
   }

   function promptSocialStory(agent) {
      var query = agent.query
      // social_story is gotten from utterance so passing it from 'suggest_theme' won't work
      var social_story = agent.context.get('prompt_social_story').parameters['social_stories']
      var theme = agent.context.get('prompt_social_story').parameters['themes']
      var target = agent.context.get('prompt_social_story').parameters['target']
      var verb = agent.context.get('prompt_social_story').parameters['themes.original']

      console.log(`Social Story: ${social_story} // Theme: ${theme} // Target: ${target}`);


      if (social_story == "" && theme == "" && target == "") {
         agent.add(modTheme.text() + " with others is fun! What else do you like doing?")
      } else {
         agent.add(getTemp.getDescriptive(social_story, theme, target))
      }

      const parameters = { 'target': target, 'themes': theme, 'social_stories': social_story}
      agent.context.set('choose_perspective', 1, parameters)
      console.log(query);
   }
   
   function choosePerspective(agent) {
      var query = agent.query

      var social_story = agent.context.get('choose_perspective').parameters['social_stories']
      var theme = agent.context.get('choose_perspective').parameters['themes']
      var target = agent.context.get('choose_perspective').parameters['target']
      var perspective = agent.context.get('choose_perspective').parameters['perspective']
      var perspective_original = agent.context.get('choose_perspective').parameters['perspective.original']
      console.log(perspective);
      agent.add("What will you feel after you " + perspective_original.toLowerCase() + "?")

      const parameters = { 'perspective': perspective, 'perspective.original': perspective_original, 'target': target, 'themes': theme, 'social_stories': social_story }
      agent.context.set('followup_perspective', 1, parameters)
      console.log(query);
   }

   function perspectiveFollowUp(agent) {
      var query = agent.query

      var theme = agent.context.get('followup_perspective').parameters['themes']
      var social_story = agent.context.get('followup_perspective').parameters['social_stories']
      var perspective = agent.context.get('followup_perspective').parameters['perspective']
      var perspective_original = agent.context.get('followup_perspective').parameters['perspective.original']
      var target = agent.context.get('followup_perspective').parameters['target']
      console.log(perspective);
      agent.add("What do you think your " + target + " will feel after you " + perspective_original.toLowerCase() + "?")

      const parameters = { 'perspective': perspective, 'perspective.original': perspective_original, 'target': target, 'themes': theme, 'social_stories': social_story }
      agent.context.set('prompt_consequence', 1, parameters)
      console.log(query);
   }

   function getConsequence(agent) {
      var query = agent.query

      var social_story = agent.context.get('prompt_consequence').parameters['social_stories']
      var theme = agent.context.get('prompt_consequence').parameters['themes']
      var target = agent.context.get('prompt_consequence').parameters['target']
      var perspective = agent.context.get('prompt_consequence').parameters['perspective']
      
      console.log(perspective);

      if(perspective == 'bad') {
         agent.add(getTemp.getReprimand(social_story, theme, target))
      } else {
         agent.add(getTemp.getAffirmative(social_story, theme, target))
      }
      
      agent.add("Do you want to continue talking or shall we wrap it up?")
      console.log(query);
   }
   
   function testConnection(agent) {
      const date = new Date();
      agent.context.set('test-intent-1', 1)
      agent.add("Sending response from webhook server at time: " + date.toTimeString() + ".");
      console.log("Webhook Connected");
   }

   function testIntent1(agent) {
      // var counter = increment()
      // console.log(counter); // counter for when 

      // agent.context.get('test-intent')
      // ^ set input context doesn't work, needs to be explicitly called in Dialogflow input contexts ^ //

      // const parameters = { query: input, };
      // agent.context.set('test-intent-2', 1, parameters);

      // var query = agent.query
      // var verb = nlp(query).verbs().toGerund().text()
      // verb = nlp(verb).verbs().toInfinitive().text()

      // if (verb == "") {
      //    agent.add("something else")
      //    const parameters = { query: query, };
      //    agent.context.set('test-intent-a', 1, parameters);
      // } else {
      //    agent.add("verb found: " + verb)
      //    const parameters = { verb: verb, };
      //    agent.context.set('test-intent-b', 1, parameters);
      // }
      
      var counter = increment(0)
      
      if (counter % 4 != 0) {
         agent.context.set('test-intent-2', 1)
         agent.add(counter.toString())
      } else {
         agent.context.set('test-intent-2', 1)
         agent.add("nice")
      }

      console.log(counter);
   }

   function testIntent2(agent) {
      var query = agent.query

      const months = ["January", "February", "March", "April", "May", "June", "July"];

      const random = Math.floor(Math.random() * months.length);
      console.log(random, months[random]);
      // ^ Apply this to main conversation to give chatbot response variety ^ //

      // agent.context.set('test-intent-1', 1);
      // ^ output context ^ //
      agent.add(months[random])
      agent.context.set('test-intent-1', 1)
   }

   function testIntentA(agent) {
      agent.context.set('test-intent-b', 1)
      agent.add("Test Intent A")
   }

   function testIntentB(agent) {
      agent.context.set('test-intent-a', 1)
      agent.add("Test Intent B")
   }

   var intentMap = new Map();
   intentMap.set('1_give_name', getName);
   intentMap.set('2_used_chatbot', hasUsedChatbot);
   intentMap.set('3_give_sentiment', giveSentiment);
   intentMap.set('4_give_activity', giveActivity);
   intentMap.set('5_prepare_activity', prepareActivity);
   intentMap.set('6_affirm_activity', affirmActivity);
   intentMap.set('5_prepare_social_story', prepareSocialStory);
   intentMap.set('5.5_return_activity', returnActivity);
   intentMap.set('6_prepare_social_story_target', prepareSocialStoryTarget);
   intentMap.set('7_affirm_social_story', affirmSocialStory);
   intentMap.set('7.1_suggest_theme', suggestTheme);
   intentMap.set('7.2_prompt_suggestion', promptSuggestion);
   intentMap.set('8_prompt_social_story', promptSocialStory);
   intentMap.set('9_choose_perspective', choosePerspective);
   intentMap.set('10_followup_perspective', perspectiveFollowUp);
   intentMap.set('11_prompt_consequence', getConsequence);
   intentMap.set('test_connection', testConnection);
   intentMap.set('test_intent_1', testIntent1);
   intentMap.set('test_intent_2', testIntent2);
   intentMap.set('test_intent_a', testIntentA);
   intentMap.set('test_intent_b', testIntentB);
   agent.handleRequest(intentMap);
});

app.listen(9090, () => {
   console.log("\n-----Conversation start-----\n");
})