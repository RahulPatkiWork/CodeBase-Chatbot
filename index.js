// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';


//carousel
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  LinkOutSuggestion,
  Permission,
  Suggestions,
  Carousel,
  Image,


  
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
//
//Basic card for no screen
//

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
  'Refer codes': {
    title: 'Reference codes',
    text: 'This option will redirect you to the codes repository ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1XOJfCg_A8Mv6-HaL9Fpf7fhLBkft5vDD',
      accessibilityText: 'Code repository',
    },
    display: 'WHITE',
  },
  'Go to IDE': {
    title: 'Go to IDE',
    text: 'This option will redirect you to the IDE ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1SveVxeW2pQZaVMHE_cnWLk1Go1-sykWO',
      accessibilityText: 'IDE',
    },
    display: 'WHITE',
  },
  'Go to interview questions': {
    title: 'Go to interview questions',
    text: 'This option will redirect you to the Interview questions ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1-yEPuuLRMVHjJU7sXLZEJCo_w1bpBdlz',
      accessibilityText: 'Interview questions',
    },
    display: 'WHITE',
  },
};
//end Basic card for no screen

//
//BrowseCarousel
//
const fakeColorCarousel = () => {
  const carousel = new BrowseCarousel({
  items: [
    new BrowseCarouselItem({
      title: 'Refer codes',
      url: 'https://drive.google.com/open?id=1XSJ-H5acd_efhjmA5brT_vxRiyD5cU82',
      description: 'Open a downloadable Program Repository',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1XOJfCg_A8Mv6-HaL9Fpf7fhLBkft5vDD',
        alt: 'Code Repository',
      }),
      footer: 'Code Repository',
    }),
    new BrowseCarouselItem({
      title: 'Go to IDE',
      url: 'https://ide.geeksforgeeks.org',
      description: 'Run programs online',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1SveVxeW2pQZaVMHE_cnWLk1Go1-sykWO',
        alt: 'Open IDE',
      }),
      footer: 'Open IDE',
    }),
    new BrowseCarouselItem({
      title: 'Go to interview questions',
      url: 'https://web.programminghub.io/#/interviewquestions/Python',
      description: 'Checkout common interview questions',
      image: new Image({
        url: 'https://drive.google.com/uc?id=128F5joCO8-NSvd57OR7LyV6xrVmMYwdB',
        alt: 'Get Interview Questions',
      }),
      footer: 'Interview Questions',
    }),
  ],
});
 return carousel;
};
//end BrowseCarousel

//-------------
//intent handlers
//---------------

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
 const name = conv.user.storage.userName;
 if (!name) {
   // Asks the user's permission to know their name, for personalization.
   conv.ask(new Permission({
     context: 'Hi there, to get to know you better',
     permissions: 'NAME',
   }));
 } else {
   conv.ask(`Hi again, ${name}. Please select a programming language for codebase from suggestions:`);
   conv.ask(new Suggestions('Python', 'R', 'C Programming', 'Java','VB.Net','C++','Javascript','Other' ));
 }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no issue mate! Please select a programming language for codebase from suggestions:`);
    conv.ask(new Suggestions('Python', 'R', 'C Programming', 'Java','VB.Net','C++','Javascript','Other' ));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for the duration of the conversation.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. Please select a programming language for codebase from suggestions:`);
    conv.ask(new Suggestions('Python', 'R', 'C Programming', 'Java','VB.Net','C++','Javascript','Other'));
  }
});

// Handle the Dialogflow NO_INPUT intent.
// Triggered when the user doesn't provide input to the Action
app.intent('actions_intent_NO_INPUT', (conv) => {
  // Use the number of reprompts to vary response
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Which programming language would you like to hear about?');
  } else if (repromptCount === 1) {
    conv.ask(`Please say the name of a programming language.`);
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's ` +
      `try this again later. Goodbye.`);
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {subject}) => {
  const userSubject = subject;
  const audioSound = 'https://actions.google.com/sounds/v1/office/button_push.ogg';
  if (conv.user.storage.userName) {
    // If we collected user name previously, address them by name and use SSML
    // to embed an audio snippet in the response.
    conv.ask(`<speak>${conv.user.storage.userName}, your coding language is ` +
      `${userSubject}.<audio src="${audioSound}"></audio> ` +
      `Would you like to hear about various options for your language?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
    //conv.ask(new Suggestions('Python', 'R', 'C Programming', 'Java','VB.Net','C++','Javascript'));
  } else {
    conv.ask(`<speak>your coding language is ${userSubject}.` +
      `<audio src="${audioSound}"></audio> ` +
      `Would you like to hear about various options for your language?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
  }
});

// Handle the Dialogflow intent named 'favorite color - yes' and favourite fake color-yes
app.intent(['favorite color - yes','favorite fake color - yes'], (conv) => {

 conv.ask('Please select & tap on your preferred option below:');

  
 // If the user is using a screened device, display the carousel
 if (conv.screen) return conv.ask(fakeColorCarousel());
});


// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, {fakeColor}) => {
  fakeColor = conv.arguments.get('OPTION') || fakeColor;
  // Present user with the corresponding basic card and end the conversation.
  if (!conv.screen) {
    conv.ask(colorMap[fakeColor].text);
  } else {
    conv.ask(`Here you go.`, new BasicCard(colorMap[fakeColor]));
  }
  conv.ask('Do you want to see the options again?');
  conv.ask(new Suggestions('Yes','No'));
});
//
//end of index-return onRequest
//

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

