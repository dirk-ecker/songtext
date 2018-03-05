const Alexa = require('alexa-sdk');
const songtext = require('./songtext');
const APP_ID = 'amzn1.ask.skill.b5fceb4b-498e-47e3-ab6e-6715aa3681bb';

const languageStrings = {
    'de-DE': {
        'translation': {
            'SKILL_NAME': 'songtext',
            'NOT_FOUND_MESSAGE': 'Ich habe keinen Eintrag für %s gefunden. ',

            'HELP_MESSAGE': "Du kannst mich nach Songtexten fragen. ",
            'HELP_REPROMPT': "Was möchtest Du wissen? ",
            'STOP_MESSAGE': 'Tschüss '
        }
    }
};

const requestHandler = function(event, context, callback) {
    console.log('event', JSON.stringify(event));
    console.log('context', JSON.stringify(context));
    const applicationId = event.session.application.applicationId;
    if (applicationId !== APP_ID) {
         callback('Ungültige Application ID');
    }
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
      const output = 'Hallo und willkommen bei songtext. Songtext liest Dir den Songtext eines von Dir gesuchten Liedes vor. Sage z.B. einfach "Alexa frage songtext von enjoy".';
      this.emit(':tellWithCard', output, this.t('SKILL_NAME'), output);
    },

    'GetSongtext': function() {
        console.log('GetSongtext', JSON.stringify(this.event.request));
        const name = this.event.request.intent ? this.event.request.intent.slots.name.value : '';
        let speechOutput;
        let cardOutput;
        if (name) {
            songtext.searchLyrics(name, (title, artist, lyrics) => {
                if (!title || !artist || !lyrics ) {
                    speechOutput = this.t('NOT_FOUND_MESSAGE', name);
                    cardOutput = speechOutput;
                } else {
                    console.log('title', title);
                    console.log('artist', artist);
                    console.log('lyrics', lyrics.length);

                    speechOutput = `Ich habe den Titel <break time="500ms"/>${title} gefunden, gesungen von <break time="500ms"/>${artist}. Hier kommt der Songtext <break time="1s"/>${lyrics}`;
                    cardOutput = `Ich habe den Titel "${title}" gefunden, gesungen von "${artist}".\nHier kommt der Songtext:\n${lyrics}`;
                }
                this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), cardOutput);
            });
        } else {
            const output = 'Du hast keinen Titel angegeben. Bitte frage nach einem Titel.';
            this.emit(':tellWithCard', output, this.t('SKILL_NAME'), output);
        }
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t(HELP_MESSAGE), this.t(HELP_REPROMPT));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    },
    'Unhandled': function() {
        this.emit(':ask',
            'Entschuldigung, ich habe Dich nicht verstanden.',
            'Kannst Du das nochmal wiederholen?');
    }
};

exports.handler = requestHandler;