const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
//const admin = require('firebase-admin');
//const actions = require('actions-on-google');
const { Card, Suggestion } = require('dialogflow-fulfillment');
//const { BasicCard } = require('actions-on-google');
const serviceAccount = require('./testbot-fmgx-980d5afb8812.json');
//const { convert } = require('actions-on-google/dist/service/actionssdk');
const stories = require('./social_stories.json');
const nlp = require('./test.js')

app.get('/', (req, res) => {
   res.send("We are live!!!");
});

var increment = (function(n) {
   return function() {
      n += 1;
      return n;
   }
}(-1));

var arr = [];

app.post('/', express.json() ,(req, res) => {
   const agent = new df.WebhookClient({
      request : req,
      response : res
   });

   function uniq(arr) {
      return Array.from(new Set(arr));
   }

   function demo(agent) {
      const date = new Date();
      agent.add("Sending response from webhook server at time: " + date.toTimeString().slice(0, 8) + ".");
      // let conv = agent.conv();
      // conv.ask("");
      // agent.add(conv);
      // console.log(agent.query)
   }

   function getName(agent) {
      var name = agent.context.get('awaiting_name').parameters['name'];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      agent.add("Hello " + name + "! It's nice to meet you, have you ever used a chatbot before?");
   }    

   function hasUsedChatbot(agent) {
      var query = agent.context.get('used_chatbot').parameters['yes_or_no'];
      if (query == 'yes') {
         agent.add("Great! I'm excited to know more about you! So how was your day today?");
      } else {
         agent.add("A chatbot is a computer program that talks like a human! I am glad to be the first chatbot you'll use. I was designed as a self-esteem enhancement chatbot, I hope we get along! So how was your day today?");
      }
   }

   function smallTalk(agent) {
      var query = agent.query
      console.log(query)
      agent.add(nlp.doReply(query))
   }

   // function promptCasualConversation(agent) {
   //    var response = stories.casual_conversation.responses[Math.floor(Math.random() * stories.casual_conversation.responses.length)];
   //    agent.add(response);
   // }

   function promptSocialStory(agent) {
      var story = agent.context.get('prompt_social_story').parameters['social_stories'];
      if(Array.isArray(stories[story].descriptive) && stories[story].descriptive.length) {
         agent.add(stories[story].descriptive.shift());
         agent.add(stories[story].directive.shift() + " " + stories[story].question.shift());
         agent.add(new Suggestion(stories[story].good_response.shift()));
         agent.add(new Suggestion(stories[story].bad_response.shift()));
      } else {
         agent.add(stories[story].directive.shift() + " " + stories[story].question.shift());
         agent.add(new Suggestion(stories[story].good_response.shift()));
         agent.add(new Suggestion(stories[story].bad_response.shift()));    
      }
      arr.push(story);
   }

   function promptPerspective(agent) {
      var story = agent.context.get('prompt_social_story').parameters['social_stories'];
      var perspective = agent.context.get('prompt_action').parameters['perspective'];
      if(perspective == 'good') {
         agent.add(stories[story].good_perspective.shift());
         stories[story].bad_perspective.shift();
      } else {
         agent.add(stories[story].bad_perspective.shift());
         stories[story].good_perspective.shift();
      }
   }

   function perspectiveFollowUp(agent) {
      var story = agent.context.get('prompt_social_story').parameters['social_stories'];
      var perspective = agent.context.get('prompt_action').parameters['perspective'];
      if(perspective == 'good') {
         agent.add(stories[story].fup_good_perspective.shift());
         stories[story].fup_bad_perspective.shift();
      } else {
         agent.add(stories[story].fup_bad_perspective.shift());
         stories[story].fup_good_perspective.shift();
         
      }
   }
   
   function promptAffirmOrReprimand(agent) {
      var story = agent.context.get('prompt_social_story').parameters['social_stories'];
      var perspective = agent.context.get('prompt_action').parameters['perspective'];
      if(perspective == 'good') {
         agent.add(stories[story].affirmation.shift());
         stories[story].reprimand.shift();
      } else {
         agent.add(stories[story].reprimand.shift());
         stories[story].affirmation.shift();
      }
      agent.add("How do you feel about what you just learned?");
   }

   function wrap_up(agent) {
      var obj = {};
      for(let n of arr) {
         obj[n] = true;
      }
      let b = Object.keys(obj);
      console.log(b);
      var i = increment();
      if(i == 0) {
         agent.add("After learning the proper things to do in different situations, I will ask you some  questions again, just to know how much you’ve learned.");
         agent.add(stories[b[i]].quiz.shift());
      } else {
         agent.add(stories[b[i]].quiz.shift());
      }
   }
   
   var intentMap = new Map();
   intentMap.set('webhook', demo);
   intentMap.set('1_give_name', getName);
   intentMap.set('2_used_chatbot', hasUsedChatbot);
   intentMap.set('small talk', smallTalk);
   //intentMap.set('3_casual_conversation', promptCasualConversation);
   //intentMap.set('3_casual_conversation - custom', promptCasualConversation);
   intentMap.set('4_prompt_social_story', promptSocialStory);
   intentMap.set('6_prompt_perspective', promptPerspective);
   intentMap.set('7_followup_perspective', perspectiveFollowUp);
   intentMap.set('8_prompt_affirmation', promptAffirmOrReprimand);
   intentMap.set('prompt_quiz', wrap_up);
   intentMap.set('prompt_quiz_1', wrap_up);
   agent.handleRequest(intentMap);
});

app.listen(9090, () => {
   console.log("\n-----Conversation start-----\n");
})